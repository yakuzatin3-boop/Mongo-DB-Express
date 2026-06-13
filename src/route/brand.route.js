import express from "express";
import { createBrand , deleteBrand, getBrands} from "../controller/brand.controller.js";

const Brandrouter = express.Router();

Brandrouter.post("/brand", createBrand);
Brandrouter.delete("/brand", deleteBrand);
Brandrouter.get("/brand", getBrands);

export default Brandrouter;