import cartModel from "../model/cart.model.js";

export const addtocart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { product, quantity } = req.body;

    if (!product || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product and quantity are required"
      });
    }

    let cart = await cartModel.findOne({ user: userId });

    // 🆕 CREATE CART
    if (!cart) {
      cart = await cartModel.create({
        user: userId,
        items: [{ product, quantity }]
      });
    } 
    // 🔄 UPDATE CART
    else {
      const index = cart.items.findIndex(
        (item) => item.product.toString() === product
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ product, quantity });
      }

      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty"
      });
    }

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};