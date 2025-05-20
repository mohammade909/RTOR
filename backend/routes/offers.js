const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offers");

router.post("/create", offerController.createOffer);
router.put("/update/:offer_id", offerController.updateOffer);
router.get("/:offer_id", offerController.getOfferById);
router.delete("/delete/:offer_id", offerController.deleteOffer);
router.get("/user/:user_id", offerController.getRewardsByUserId);
router.get("/", offerController.getAllOffersWithUsers);
router.get("/referred/:userId/:startDate/:endDate/:userPlanVal", offerController.getReferredUsers);
router.post("/mine", offerController.mineOffer);

module.exports = router;
