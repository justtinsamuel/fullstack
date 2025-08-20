const { BrandController } = require("../controllers/BrandControllers");
const brandRouter = require("express").Router();

brandRouter.get("/", BrandController.getBrands);
brandRouter.post("/add", BrandController.add);
brandRouter.delete("/delete/:id", BrandController.delete);
brandRouter.put("/edit/:id", BrandController.edit);
brandRouter.get("/search", BrandController.search);
brandRouter.get("/details/:id", BrandController.getBrandById);

module.exports = brandRouter;