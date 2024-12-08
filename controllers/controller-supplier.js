const Supplier = require("../models/supplier");

module.exports = {
    'createSupplier': async (req, res) => { 
        try { 
            const { externalId, name, phone, email, address, products } = req.body; if (!externalId) { 
                return res.status(400).json({ state: false, message: "externalId es requerido" }); 
            } // Verificar si el proveedor ya existe por externalId 
            const existingSupplier = await Supplier.findOne({ externalId }); 
            if (existingSupplier) { 
                return res.status(400).json({ state: false, message: "El proveedor ya existe." }); 
            } // Crear nuevo proveedor 
            const newSupplier = new Supplier({ externalId, // Asignar el ID externo 
                name, phone, email, address, Product: products, createdAt: new Date(), updatedAt: new Date() }); 
                const savedSupplier = await newSupplier.save(); 
                return res.status(201).json({ state: true, data: savedSupplier }); 
            } catch (error) { return res.status(500).json({ state: false, message: error.message }); 
        }
    },
    'listSupplier' : async(req, res) =>{
        try { 
            const suppliers = await Supplier.find(); 
            return res.status(200).json({ state: true, data: suppliers }); 
        } catch (error) { 
            return res.status(500).json({ state: false, message: error }); 
        }
    },
    'updateSupplier': async(req, res) =>{
        const { id } = req.params; // Aquí usamos el _id generado por MongoDB 
        const updates = req.body; 
        try { const updatedSupplier = await Supplier.findByIdAndUpdate(id, updates, { new: true }); 
        if (!updatedSupplier) { 
            return res.status(404).json({ state: false, message: "Proveedor no encontrado." }); 
        } 
        return res.status(200).json({ state: true, data: updatedSupplier }); 
    } catch (error) { 
        return res.status(500).json({ state: false, message: error.message }); 
    }

    },
    'deleteSupplier':async(req, res) =>{
        const { id } = req.params; // Aquí usamos el _id generado por MongoDB 
        try { 
            const deletedSupplier = await Supplier.findByIdAndDelete(id);
             if (!deletedSupplier) { 
                return res.status(404).json({ state: false, message: "Proveedor no encontrado." }); 
            } 
            return res.status(200).json({ state: true, message: "Proveedor eliminado." }); 
        } catch (error) { 
            return res.status(500).json({ state: false, message: error.message }); 
        }
    },
    'findById': async (req, res) => { 
        const { id } = req.params; // Aquí usamos el _id generado por MongoDB 
        try { 
            const supplier = await Supplier.findById(id).populate('products'); 
            if (!supplier) { 
                return res.status(404).json({ state: false, message: "Proveedor no encontrado."}); 
            } 
            return res.status(200).json({ state: true, data: supplier });
         } 
            catch (error) { 
                return res.status(500).json({ state: false, message: error.message }); 
            } 
        }
}