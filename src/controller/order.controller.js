
import orderModel from "../model/order.model.js";
import productModel from "../model/product.model.js";
import paymentModel from "../model/payment.model.js";
import { generateKHQRFromOrder } from "../services/khqr.service.js";
import { sendTelegramMessage } from "../services/telegram.service.js";
import { newOrderTemplate } from "../utils/telegramTemplates.js";

// export const createorder = async (req, res) => 
//     try {
//         const { products } = req.body;
//         const userId = req.user.id;

//         if (!products || products.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Products are required"
//             });
//         }

//         let totalPrice = 0;

//         const productDetails = await Promise.all(
//             products.map(async (item) => {
//                 const product = await productModel.findById(item.product);

//                 if (!product) {
//                     throw new Error("Product not found");
//                 }

//                 totalPrice += product.price * item.quantity;

//                 return {
//                     product: item.product,
//                     quantity: item.quantity,
//                     price: product.price
//                 };
//             })
//         );

//         const order = await orderModel.create({
//             user: userId,
//             products: productDetails,
//             totalPrice,
//             status: "pending",
//             paymentStatus: "unpaid",
//             paymentMethod: "bakong"
//         });

//         // Generate KHQR
//         const khqr = await generateKHQRFromOrder(order);

//         // Save KHQR Data
//         order.transactionId = khqr.transactionId;
//         order.khqrPayload = khqr.payload;
//         order.qrImage = khqr.qrImage;

//         await order.save();

//         // Telegram Notification
//         try {
//             const message = newOrderTemplate(order);
//             await sendTelegramMessage(message);
//         } catch (telegramError) {
//             console.error("Telegram Error:", telegramError.message);
//         }

//         return res.status(201).json({
//             success: true,
//             message: "Order created with KHQR",
//             order,
//             payment: khqr
//         });

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
export const getorder = async (req, res) => {
    try {
        const orders = await orderModel
            .find()
            .populate("user", "name email")
            .populate("products.product", "name price image")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getsingleorder = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        const order = await orderModel
            .findById(orderId)
            .populate("user", "name email")
            .populate("products.product", "name price image");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.user._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not allowed"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const myOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await orderModel
            .find({ user: userId })
            .populate("products.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatus = [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const order = await orderModel.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated",
            order
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteorder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        await order.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createorder = async (req, res) => {
    try {
        const {
            products,
            items,
            paymentMethod = "bakong",
            shippingAddress
        } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const orderItems = Array.isArray(products) && products.length > 0
            ? products
            : Array.isArray(items) && items.length > 0
                ? items
                : [];

        if (!orderItems.length) {
            return res.status(400).json({
                success: false,
                message: "Products are required"
            });
        }

        const allowedPaymentMethods = ["bakong", "cash", "card"];
        if (!allowedPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        let totalPrice = 0;

        const productDetails = await Promise.all(
            orderItems.map(async (item) => {
                const product = await productModel.findById(item.product);

                if (!product) {
                    throw new Error("Product not found");
                }

                const quantity = item.quantity ?? 1;
                if (quantity <= 0) {
                    throw new Error("Invalid quantity");
                }

                totalPrice += product.price * quantity;

                return {
                    product: product._id,
                    quantity,
                    price: product.price
                };
            })
        );

        const orderData = {
            user: userId,
            products: productDetails,
            totalPrice,
            status: "pending",
            paymentStatus: "unpaid",
            paymentMethod
        };

        if (shippingAddress) {
            orderData.shippingAddress = shippingAddress;
        }

        const order = await orderModel.create(orderData);

        let payment = await paymentModel.create({
            user: userId,
            order: order._id,
            paymentMethod,
            amount: totalPrice,
            status: "pending"
        });

        if (paymentMethod === "bakong") {
            const khqr = await generateKHQRFromOrder(order);

            order.transactionId = khqr.transactionId;
            order.khqrPayload = khqr.payload;
            order.qrImage = khqr.qrImage;
            await order.save();

            payment.transactionId = khqr.transactionId;
            await payment.save();
        }

        order.payment = payment._id;
        await order.save();

        const responsePayload = {
            success: true,
            message: "Order created successfully",
            orderId: order._id,
            amount: totalPrice,
            payment
        };

        if (paymentMethod === "bakong") {
            responsePayload.transactionId = order.transactionId;
            responsePayload.qrImage = order.qrImage;
        }

        return res.status(201).json(responsePayload);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const verifyPayment = async (req, res) => {
    try {
        const { transactionId } = req.body;

        const payment = await paymentModel.findOne({ transactionId });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        const isPaid = true;

        if (isPaid) {
            payment.status = "paid";
            payment.paidAt = new Date();
            await payment.save();

            await orderModel.findByIdAndUpdate(payment.order, {
                paymentStatus: "paid",
                status: "processing"
            });
        }

        return res.json({
            success: true,
            status: payment.status
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrderQr = async (req, res) => {
    try {
        const userId = req.user?.id;
        const orderId = req.params.id;

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not allowed"
            });
        }

        if (order.paymentMethod !== "bakong") {
            return res.status(400).json({
                success: false,
                message: "QR is only available for Bakong payments"
            });
        }

        if (!order.transactionId || !order.qrImage) {
            const khqr = await generateKHQRFromOrder(order, order.transactionId);

            order.transactionId = order.transactionId || khqr.transactionId;
            order.khqrPayload = khqr.payload;
            order.qrImage = khqr.qrImage;
            await order.save();

            const payment = await paymentModel.findOne({ order: order._id });
            if (payment) {
                payment.transactionId = order.transactionId;
                await payment.save();
            }
        }

        return res.status(200).json({
            success: true,
            transactionId: order.transactionId,
            qrImage: order.qrImage
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const payOrder = async (req, res) => {
    try {
        const { orderId, transactionId } = req.body;
        const userId = req.user?.id;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not allowed"
            });
        }

        const payment = await paymentModel.findOne({ order: order._id });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }

        if (payment.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment is already completed"
            });
        }

        if (order.paymentMethod === "bakong") {
            if (!transactionId || transactionId !== payment.transactionId) {
                return res.status(400).json({
                    success: false,
                    message: "Valid transactionId is required for Bakong payment"
                });
            }
        }

        payment.status = "paid";
        payment.paidAt = new Date();
        await payment.save();

        await orderModel.findByIdAndUpdate(order._id, {
            paymentStatus: "paid",
            status: "processing"
        });

        return res.status(200).json({
            success: true,
            message: "Payment completed",
            orderId: order._id,
            paymentStatus: payment.status,
            transactionId: payment.transactionId || null
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const generateOrderQr = async (req, res) => {
    try {
        const userId = req.user?.id;
        const orderId = req.params.id;

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

        // force payment method to bakong if needed
        if (order.paymentMethod !== "bakong") {
            order.paymentMethod = "bakong";
        }

        // ensure a payment record exists
        let payment = await paymentModel.findOne({ order: order._id });
        if (!payment) {
            payment = await paymentModel.create({
                user: userId,
                order: order._id,
                paymentMethod: "bakong",
                amount: order.totalPrice,
                status: "pending"
            });
        }

        // generate KHQR reusing existing transactionId when possible
        const khqr = await generateKHQRFromOrder(order, order.transactionId);

        order.transactionId = khqr.transactionId;
        order.khqrPayload = khqr.payload;
        order.qrImage = khqr.qrImage;
        await order.save();

        payment.transactionId = order.transactionId;
        await payment.save();

        return res.status(200).json({ success: true, transactionId: order.transactionId, qrImage: order.qrImage });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};