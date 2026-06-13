import { createorder, getorder, myOrders, getsingleorder, deleteorder, updateOrderStatus, verifyPayment, payOrder, getOrderQr, generateOrderQr } from "../controller/order.controller.js";
import { userOnly } from "../middleware/auth.middleware.js";
import express from 'express';

const orderroute = express.Router();

// Base: /api/orders
orderroute.post('/orders', userOnly, createorder);                 // create order
orderroute.get('/orders', userOnly, getorder);                    // list all orders
orderroute.get('/orders/my', userOnly, myOrders);                 // list user orders
orderroute.get('/orders/:id', userOnly, getsingleorder);         // get single order
orderroute.put('/orders/:id/status', userOnly, updateOrderStatus); // update status
orderroute.delete('/orders/:id', userOnly, deleteorder);         // delete order

// Payment flows
orderroute.post('/orders/:id/pay', userOnly, payOrder);          // mark payment
orderroute.post('/orders/verify', userOnly, verifyPayment);      // verify bakong by transactionId

// KHQR endpoints
orderroute.post('/orders/:id/generate-qr', userOnly, generateOrderQr);
orderroute.get('/orders/:id/qr', userOnly, getOrderQr);

export default orderroute;