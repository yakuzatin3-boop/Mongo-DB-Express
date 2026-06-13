import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    image: {
        type: String,
        default: ""
    },

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    }
},
{
    timestamps: true
}
);

export default mongoose.model("Category", categorySchema);