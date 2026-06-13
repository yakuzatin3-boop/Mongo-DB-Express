import { createcategory, deleteCategory, getcategory, getcategoryId } from "../controller/category.controller.js";
import express from 'express';

const categoryroute = express.Router();

categoryroute.post('/category', createcategory);
categoryroute.get('/category', getcategory);
categoryroute.get('/category/:id', getcategoryId);
categoryroute.delete('/category/:id', deleteCategory);

export default categoryroute;