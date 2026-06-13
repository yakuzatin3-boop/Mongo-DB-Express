
import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";


export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
    req.user = await userModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token failed",
      error: error.message,
    });
  }
};

// Admin route
export const admin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Admin only",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Seller
export const seller = async (req, res, next) => {
  try {
    if (
      req.user &&
      (req.user.role === "seller" || req.user.role === "admin")
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Seller only",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User
export const userOnly = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Use Authorization: Bearer <token>"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
};