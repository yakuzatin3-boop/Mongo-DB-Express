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
        enum: [
            "bakong",
            "ABA",
            "ACLEDA",
            "cash",
            "credit_card"
        ],
        default: "bakong"
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
        enum: [
            "pending",
            "paid",
            "failed"
        ],
        default: "pending"
    },

    paidAt: {
        type: Date
    }
},
{
    timestamps: true
}
);

paymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Payment", paymentSchema);
