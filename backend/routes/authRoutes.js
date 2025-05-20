const experss = require("express");
const router = experss.Router();

const {signup,signin,adminsignin,signoutadmin,signout, emailVerification} = require("../controllers/authcontroller");
router.post("/email-verification", emailVerification);
router.post("/verify-code", emailVerification);
router.post("/register", signup);
router.post("/signin", signin);
router.post("/adminsignin", adminsignin);
router.get("/signout", signout);
router.get("/signoutadmin", signoutadmin);

module.exports = router;
