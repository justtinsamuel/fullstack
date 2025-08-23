const { ItemController } = require("../controllers/ItemControllers");
const { authentication } = require("../middlewares/authentication");
const { authorization } = require("../middlewares/authorization");
const itemRouter = require("express").Router();

// GET all items
itemRouter.get("/", ItemController.getItems);

// CREATE item
itemRouter.post("/", ItemController.add);

// BULK CREATE item
itemRouter.post("/bulk", ItemController.addBulk);

// GET single item
itemRouter.get("/:id", authentication, ItemController.getItemById);

// UPDATE item
itemRouter.put("/:id", authentication, authorization, ItemController.edit);

// DELETE item
itemRouter.delete("/:id", authentication, authorization, ItemController.delete);

// SEARCH items (pakai query string: /api/items/search?name=kopi)
itemRouter.get("/search/query", ItemController.search);

module.exports = itemRouter;
