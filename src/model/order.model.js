// models/order.model.js

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],

    totalPrice: {
        type: Number,
        required: true
    },

    shippingAddress: {
        name: String,
        phone: String,
        address: String
    },

    // 💳 PAYMENT METHOD
    paymentMethod: {
        type: String,
        enum: ["bakong", "cash", "card"],
        default: "bakong"
    },

    // 💳 PAYMENT STATUS (VERY IMPORTANT for KHQR system)
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid", "failed"],
        default: "unpaid"
    },

    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    },

    // 📲 KHQR DATA
    transactionId: String,
    khqrPayload: String,
    qrImage: String,

    // 📦 ORDER STATUS
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    }
},
{
    timestamps: true   
});

export default mongoose.model("Order", orderSchema);