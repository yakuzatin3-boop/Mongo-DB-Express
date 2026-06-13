import brandModel from "../model/brand.model.js";

export const createBrand = async (req, res) => {
    try {
        const { name, logo, description } = req.body;

        const existingBrand = await brandModel.findOne({ name });

        if (existingBrand) {
            return res.status(400).json({
                success: false,
                message: "Brand already exists"
            });
        }

        const brand = await brandModel.create({
            name,
            logo,
            description
        });

        res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: brand
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getBrands = async (req, res) => {
    try {
        const brands = await brandModel.find();

        res.status(200).json({
            success: true,
            data: brands
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await brandModel.findById(id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        await brandModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Brand deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};