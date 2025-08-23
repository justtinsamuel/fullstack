const { UserController } = require("../controllers/UserControllers");
const userRouter = require("express").Router();

userRouter.get("/", UserController.getUsers);
userRouter.post("/add", UserController.add);
userRouter.post("/add/bulk", UserController.addBulk);
userRouter.delete("/delete/:id", UserController.delete);
userRouter.put("/edit/:id", UserController.edit);
userRouter.get("/search", UserController.search);
userRouter.get("/details/:id", UserController.getUserById);
userRouter.post("/login", UserController.login);

module.exports = userRouter;
