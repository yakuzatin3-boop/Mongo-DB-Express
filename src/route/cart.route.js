import { addtocart, getCart, removeFromCart, clearCart } from "../controller/cart.controller.js";
import express from 'express';
import { userOnly } from "../middleware/auth.middleware.js";

const cartroute = express.Router();

cartroute.post('/',userOnly, addtocart);
cartroute.get('/:userId',userOnly, getCart);
cartroute.delete('/:userId/:productId',userOnly, removeFromCart);
cartroute.delete('/clear/:userId',userOnly, clearCart);

export default cartroute;