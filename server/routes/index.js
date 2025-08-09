const router = require("express").Router();
const base = "api";

router.get(`/${base}`, (req, res) => {
  res.json({ message: "WEB API" });
});

const itemRouters = require("./item");
const userRouters = require("./user");
const typeRouters = require("./type");
// const profileRouters = require("./profile");
const brandRouters = require("./brand");

router.use(`/${base}/items`, itemRouters);
router.use(`/${base}/users`, userRouters);
router.use(`/${base}/types`, typeRouters);
// router.use("/profiles", profileRouters);
router.use(`/${base}/brands`, brandRouters);

module.exports = router;