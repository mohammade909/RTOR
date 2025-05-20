const experss = require("express");
const { createCodes, getCodes, getCodeById } = require("../controllers/codes");
const router = experss.Router();

router.post("/", createCodes);
router.get("/", getCodes);
router.get("/:id", getCodeById);

module.exports = router;
