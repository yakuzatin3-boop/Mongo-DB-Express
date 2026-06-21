import express from "express";
import { createBrand , deleteBrand, getBrands, getBrandById} from "../controller/brand.controller.js";
import brandModel from "../model/brand.model.js";

const Brandrouter = express.Router();

Brandrouter.post("/brand", createBrand);
Brandrouter.delete("/brand", deleteBrand);
Brandrouter.get("/brand", getBrands);
Brandrouter.get("/brand/:id", getBrandById);

export default Brandrouter;