const router = require("express").Router();
const base = "api";

router.get(`/${base}`, (req, res) => {
  res.json({ message: "WEB API" });
});

const itemRouter = require("./item");
const userRouter = require("./user");
const typeRouter = require("./type");
const brandRouter = require("./brand");

router.use(`/${base}/items`, itemRouter);
router.use(`/${base}/users`, userRouter);
router.use(`/${base}/types`, typeRouter);
router.use(`/${base}/brands`, brandRouter);

module.exports = router;