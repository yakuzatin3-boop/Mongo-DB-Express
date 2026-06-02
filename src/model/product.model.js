// models/product.model.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    description: String,

    price: {
        type: Number,
        required: true
    },

    stock: {
        type: Number,
        default: 0
    },

    images: [
    {
        type: String
    }
    ],

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{
    timestamps: true
}
);

export default mongoose.model("Product", productSchema);