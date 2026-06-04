import { createcategory, getcategory, getcategoryId } from "../controller/category.controller.js";
import express from 'express';

const categoryroute = express.Router();

categoryroute.post('/category', createcategory);
categoryroute.get('/category', getcategory);
categoryroute.get('/category/:id', getcategoryId);

export default categoryroute;