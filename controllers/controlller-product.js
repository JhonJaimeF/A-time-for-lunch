const Product = require("../models/product");
const mongoose = require('mongoose');
const Supplier = require("../models/supplier");

module.exports = {
    'createProduct' : async (req, res) => {
        const { externalId, name, description, price,category,supplier} = req.body;
        try {
            const existingProduct = await Product.findOne({externalId});
        
            if (existingProduct) { 
                return res.status(400).json({ state: false, message: "El producto ya existe." }); 
            }

            // Verificar si el proveedor existe 
            const existingSupplier = await Supplier.findById(supplier); 
            if (!existingSupplier) { 
                return res.status(400).json({ state: false, message: "El proveedor no existe." }); 
            }

            const newProduct = new Product({ 
                externalId, 
                name, 
                description,
                price,
                category,
                supplier,
                createdAt: new Date(),
                updatedAt: new Date()}); 
         

            const savedProduct = await newProduct.save(); 
            await Supplier.findByIdAndUpdate(supplier, { $push: { Product:savedProduct._id } }); 

            return res.status(201).json({ state: true, data: savedProduct }); 
        } catch (error) { 
            return res.status(500).json({ state: false, message: error.message }); 
        }
    },
    'listProducts' : async (req, res) => {

        try { 
            //const products = await Product.find().populate('supplier'); 
            const products = await Product.find(); 
            return res.status(200).json({ state: true, data: products }); 
        } catch (error) { 
            return res.status(500).json({ state: false, message: error.message }); 
        }

    },
    'updateProduct': async (req, res) => {
        const { id } = req.params; 
        const updates = req.body; 
        try { const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true }); 
        if (!updatedProduct) { 
            return res.status(404).json({ state: false, message: "Producto no encontrado." }); 
        } 
            return res.status(200).json({ state: true, data: updatedProduct }); 
        } catch (error) { 
            return res.status(500).json({ state: false, message: error.message }); 
        }
    },
    'DeleteProduct': async (req, res) => {
        
        const { id } = req.params; 
        try { const deletedProduct = await Product.findByIdAndDelete(id); 
            if (!deletedProduct) { 
                return res.status(404).json({ state: false, message: "Producto no encontrado." }); 
            } 
            
            await Supplier.findByIdAndUpdate(deletedProduct.supplier, { $pull: { Product: deletedProduct._id } }); 
            return res.status(200).json({ state: true, message: "Producto eliminado." }); 
        } catch (error) { 
        return res.status(500).json({ state: false, message: error.message }); 
    }

    },
    'findById': async (req, res) => {

        const { id } = req.params; 
        try { 
            const product = await Product.findById(id); 
            if (!product) { 
                return res.status(404).json({ state: false, message: "Producto no encontrado." }); 
            } 
            return res.status(200).json({ state: true, data: product }); 
        } catch (error) { 
            return res.status(500).json({ state: false, message: errormessage }); 
        }

    },
    'listProductsBySupplier': async (req, res) => {
        const { id } = req.params; 
        try { 
            // Convertir el id a un ObjectId de MongoDB 
            const objectId = new mongoose.Types.ObjectId(id); 
            const products = await Product.find({ supplier: objectId }); 
            if (!products || products.length === 0) { 
                return res.status(400).json({ state: false, message: "No se encontraron productos asociados" }); 
            } 
            return res.status(200).json({ state: true, data: products }); 
        } catch (error) { 
            return res.status(500).json({ state: false, message: error.message }); 
        }
    }
}