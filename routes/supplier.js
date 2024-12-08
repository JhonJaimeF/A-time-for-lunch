const routes = require('express').Router();
const { 
    createSupplier,
    updateSupplier,
    deleteSupplier,
    listSupplier,
    findById

}= require('../controllers/controller-supplier');

routes.post("/", createSupplier)
routes.put("/:id", updateSupplier)
routes.delete("/:id", deleteSupplier)
routes.get("/", listSupplier)
routes.get("/:id", findById)

module.exports = routes;