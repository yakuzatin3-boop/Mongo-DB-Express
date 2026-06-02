import { createorder, getorder, myOrders, getsingleorder, deleteorder, updateOrderStatus } from "../controller/order.controller.js";
import { userOnly } from "../middleware/auth.middleware.js";
import express from 'express';

const orderroute = express.Router();

orderroute.post('/order',userOnly, createorder);
orderroute.get('/order',userOnly, getorder);
orderroute.get('/order/my', userOnly, myOrders);
orderroute.get('/order/:id', userOnly,getsingleorder );
orderroute.put('/order/:id/status', userOnly, updateOrderStatus);
orderroute.delete('/order/:id', userOnly, deleteorder);

export default orderroute;