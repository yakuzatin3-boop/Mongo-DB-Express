import categoryModel from "../model/category.model.js";

export const createcategory = async (req, res) => {
    try{
        const category = await categoryModel.create(req.body);
         
        res.status(201).json({
            sucess:true,
            category
        })
    }catch(error){
        res.status(500).json({
            sucess:false,
            message: error.message
        });
    };
};

export const getcategory = async (req, res)=>{
    try{
        const categorys = await categoryModel.find();
        res.json({
            sucess: true,
            categorys
        });

    }catch(error){
        res.status(500).json({
            sucess: false,
            message: error.message
        });
    };
};