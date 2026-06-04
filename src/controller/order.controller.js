
import orderModel from "../model/order.model.js";
import productModel from "../model/product.model.js";
import { generateKHQRFromOrder } from "../services/khqr.service.js";
import TelegramBot from "node-telegram-bot-api";
import { sendTelegramMessage } from "../services/telegram.service.js";
import { newOrderTemplate } from "../utils/telegramTemplates.js";

export const createorder = async (req, res) => {
    try {
        const { products } = req.body;
        const userId = req.user.id;

        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Products are required"
            });
        }

        let totalPrice = 0;

        const productDetails = await Promise.all(
            products.map(async (item) => {
                const product = await productModel.findById(item.product);

                if (!product) {
                    throw new Error("Product not found");
                }

                totalPrice += product.price * item.quantity;

                return {
                    product: item.product,
                    quantity: item.quantity,
                    price: product.price
                };
            })
        );

        const order = await orderModel.create({
            user: userId,
            products: productDetails,
            totalPrice,
            status: "pending",
            paymentStatus: "unpaid",
            paymentMethod: "bakong"
        });

        // Generate KHQR
        const khqr = await generateKHQRFromOrder(order);

        // Save KHQR Data
        order.transactionId = khqr.transactionId;
        order.khqrPayload = khqr.payload;
        order.qrImage = khqr.qrImage;

        await order.save();

        // Telegram Notification
        try {
            const message = newOrderTemplate(order);
            await sendTelegramMessage(message);
        } catch (telegramError) {
            console.error("Telegram Error:", telegramError.message);
        }

        return res.status(201).json({
            success: true,
            message: "Order created with KHQR",
            order,
            payment: khqr
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
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