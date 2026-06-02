
import userModel from "../model/user.model.js";

export const createUser = async (req, res) => {

    try {

        const user = await userModel.create(req.body);

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getUser = async (req, res) => {

    try {

        const users = await userModel.find();

        res.status(200).json({
            success: true,
            message: "Users Found",
            data: users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });

    }

};

export const getByid = async (req, res) => {

    try {

        const user = await userModel.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });

        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });

    }

};

export const updateUser = async (req, res) => {

    try {

        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message: "User Updated",
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const deleteUser = async (req, res) => {

    try {

        const user = await userModel.findByIdAndDelete(req.params.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });

        }

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};