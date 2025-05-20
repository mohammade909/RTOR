const experss = require("express");
const router = experss.Router();

const {signup,signin,adminsignin,signoutadmin,signout, emailVerification, emailVerificationForUpdate, verifyOtp} = require("../controllers/authcontroller");
router.post("/otp-code", verifyOtp);
router.post("/email-verification", emailVerification);
router.post('/verify-user', emailVerificationForUpdate)
router.post("/register", signup);
router.post("/signin", signin);
router.post("/adminsignin", adminsignin);
router.get("/signout", signout);
router.get("/signoutadmin", signoutadmin);

module.exports = router;
