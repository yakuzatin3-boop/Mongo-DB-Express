import userModel from "../model/user.model.js";
import bcrypt, { hash } from "bcryptjs";
import jwt from'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};


export const register = async (req, res)=>{
    try{
        const { name, email, password } = req.body;
        const userExist = await userModel.findOne({ email });

        if(userExist){
            return res.status(400).json({
                sucess:false,
                message:'User already exist'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            name,
            email,
            password:hashedPassword
        });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "Register Success",
            token,
            user
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};
export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });

        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login Success",
            token,
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
