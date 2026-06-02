// models/payment.model.js

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["ABA", "ACLEDA", "Cash", "Credit Card"],
        default: "Cash"
    },

    transactionId: {
        type: String
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    }
},
{
    timestamps: true
}
);

export default mongoose.model("Payment", paymentSchema);