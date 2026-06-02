import { createcategory, getcategory } from "../controller/category.controller.js";
import express from 'express';

const categoryroute = express.Router();

categoryroute.post('/category', createcategory);
categoryroute.get('/category', getcategory);

export default categoryroute;