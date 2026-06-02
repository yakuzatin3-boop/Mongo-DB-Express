import { createproduct, getproduct, getsingleproduct, deleteproduct, updateProduct } from "../controller/product.controller.js";
import express from 'express';

const productroute = express.Router();

productroute.post('/product', createproduct);
productroute.get('/product', getproduct);
productroute.get('/product/:id', getsingleproduct);
productroute.delete('/product/:id', deleteproduct);
productroute.put('/product/:id', updateProduct);

export default productroute;