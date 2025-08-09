const { TypeController } = require("../controllers");
const typeRouter = require("express").Router();

typeRouter.get("/", TypeController.getTypes);
typeRouter.post("/add", TypeController.add);
typeRouter.delete("/delete/:id", TypeController.delete);
typeRouter.put("/edit/:id", TypeController.edit);
typeRouter.get("/search", TypeController.search);
typeRouter.get("/details/:id", TypeController.getTypeById);

module.exports = typeRouter;
