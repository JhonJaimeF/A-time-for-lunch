const Inventory = require("../models/Inventory")
const Product = require("../models/product")

module.exports = {
    'addProductsInventory': async (req, res) => { 
        const {product, quantity } = req.body; 
        try { 
            const existProductInventory = await Inventory.findOne({ product: product }); if (existProductInventory) { 
                return res.status(400).send({ state: false, message: "El producto ya existe en el inventario." }); 
            }

            const existingProduct = await Product.findById(product); 
            if (!existingProduct) { 
                return res.status(400).send({ state: false, message: "El producto no existe." }); 
            } 
            const newProductInventory = new Inventory({product, quantity, createdAt: new Date(), updatedAt: new Date() }); 

            const savedProductInventory = await newProductInventory.save(); 

            return res.status(201).json({ state: true, data:savedProductInventory }); 

        } catch (error) { 
            return res.status(500).send({ state: false, message: error.message }); 
        }
    },

    'ListProductsInventory': async (req,res) => {
        try {
            //const products = await Inventory.find().populate('product');
            const products = await Inventory.find();
            return res.status(200).json({ state: true, data: products }); 
        } catch (error) { 
            return res.status(500).json({ state: false, message: error.message }); 
        }

    },
    'updateProduct': async (req, res) => { 
        const { id } = req.params; 
        const { quantity } = req.body; 
        if (quantity < 0) { 
            return res.status(400).json({ state: false, message: "La cantidad no puede ser menor que cero." }); 
        } 
        
        try { // Obtener el producto actual para comparar la cantidad 
            const currentProduct = await Inventory.findById(id); 
            if (!currentProduct) { 
                return res.status(404).json({ state: false, message: "Producto no encontrado." }); 
            } 
            
            if (quantity >= currentProduct.quantity) { 
                return res.status(400).json({ state: false, message: "La nueva cantidad debe ser menor que la cantidad actual." }); 
            } // Actualizar solo si la cantidad es menor que la actual 
            const updatedProduct = await Inventory.findByIdAndUpdate( id, { $set: { quantity } }, { new: true } ); 
            return res.status(200).json({ state: true, data: updatedProduct }); 
        } catch (error) { 
            return res.status(500).json({ state: false, message: error.message }); 
        }
    },
    'findById': async (req,res) => {

    },
    'findByCategory': async (req,res) => {
    },
}