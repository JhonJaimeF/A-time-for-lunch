const routes = require('express').Router();

const { 
    addProductsInventory,
    ListProductsInventory,
    updateProduct,
    findByCategory,
    findById

} = require("../controllers/controller-Inventory");
routes.post("/", addProductsInventory)
routes.put("/:id", updateProduct)
routes.get("/", ListProductsInventory)
routes.get("", )

module.exports = routes;