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

export const getcategory = async (req, res) => {
  try {
    const { brand } = req.query;

    let filter = {};

    if (brand) {
      filter.brand = brand;
    }

    const categorys = await categoryModel.find(filter);

    res.json({
      success: true,
      categorys,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getcategoryId = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            category
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await categoryModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};