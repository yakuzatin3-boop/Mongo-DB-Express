import productModel from "../model/product.model.js";

export const createproduct = async (req, res) =>{
    try{
        const product = await productModel.create(req.body);
        res.status(201).json({
            sucess: true,
            message: 'Product created Ah poy',
            product
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};
export const getproduct = async (req, res) => {
  try {
    const { brand, category } = req.query;

    let filter = {};

    if (brand) filter.brand = brand;
    if (category) filter.category = category;

    const products = await productModel
      .find(filter)
      .populate("brand")
      .populate("category");

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getsingleproduct = async (req, res)=>{
    try{

        const product = await productModel
        .findById(req.params.id)
        .populate("brand")
        .populate('category')
        .populate('user', '-password')

        if(!product){
            return res.status(404).json({
                success: false,
                message: 'Product not found Ah poy'
            })
        }
        res.status(200).json({
            success: true,
            product
        })
    }catch(error){
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
};
export const deleteproduct = async (req, res) => {
    try{

        const product = await productModel.findByIdAndDelete(req.params.id);

        if(!product){
            return res.status(404).json({
                sucess: false,
                message:'Product not found ah poy'
            });
        }

        res.status(200).json({
            sucess: true,
            message: 'Product Delete'
        })

    }catch(error){
        res.status(500).json({
            sucess: false,
            message: error.message
        })
    }
};
export const updateProduct = async (req, res) => {

    try {

        const { id } = req.params;

        const product = await productModel.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

