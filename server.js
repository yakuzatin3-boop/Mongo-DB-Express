import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import DB from './src/config/DB.config.js';
import dotenv from 'dotenv';

import userroute from './src/route/user.route.js';
import authroute from './src/route/auth.route.js';
import categoryroute from './src/route/category.route.js';
import productroute from './src/route/product.route.js';
import cartroute from './src/route/cart.route.js';
import orderroute from './src/route/order.route.js';
import Brandrouter from './src/route/brand.route.js';
import { verifyPayment } from './src/controller/order.controller.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

DB();

app.get('/', (req, res) => {
    res.send("Server is Running Ah Poy");
});

app.use('/api', userroute);
app.use('/api', authroute);
app.use('/api', categoryroute);
app.use('/api', productroute);
app.use('/api/cart', cartroute);
app.use('/api', orderroute);
app.use('/api', Brandrouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is Running on http://localhost:${PORT}`);
});