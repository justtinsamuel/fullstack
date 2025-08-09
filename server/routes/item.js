const { ItemController } = require("../controllers");
const { authentication, authorization } = require("../middlewares/auth");
const itemRouter = require("express").Router();

itemRouter.get("/", ItemController.getItems);
itemRouter.post("/add", authentication, ItemController.add);
itemRouter.delete(
  "/delete/:id",
  authentication,
  authorization,
  ItemController.delete
);
itemRouter.put("/edit/:id", authentication, authorization, ItemController.edit);
itemRouter.get("/details/:id", authentication, ItemController.getItemById);
itemRouter.get("/search", ItemController.search);

module.exports = itemRouter;
