import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    price: {
        type: Number,
        required: true
    },

    originalPrice: {
        type: Number,
        default: 0
    },

    discount: {
        type: Number,
        default: 0
    },

    stock: {
        type: Number,
        default: 0
    },

    sold: {
        type: Number,
        default: 0
    },

    images: [
        {
            type: String
        }
    ],

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    featured: {
        type: Boolean,
        default: false
    },

    bestSeller: {
        type: Boolean,
        default: false
    },

    flashSale: {
        type: Boolean,
        default: false
    },

    isNew: {
        type: Boolean,
        default: true
    },

    rating: {
        type: Number,
        default: 0
    },

    totalReviews: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },

    specifications: {
        screen: String,
        processor: String,
        ram: String,
        storage: String,
        battery: String,
        operatingSystem: String
    },

    tags: [
        {
            type: String
        }
    ],

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