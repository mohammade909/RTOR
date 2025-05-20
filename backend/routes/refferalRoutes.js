const express = require('express');
const router = express.Router()
const  { getReferralTree ,getFullReferralTree,calculateCommissionForAllUsers} = require('../controllers/refferalController')
const { updateROIIncomeForUsers, processSelfTrade, getLatestRoiDate } = require('../controllers/CornJobController');
const { callAllFunctionsSequentially } = require('../controllers/jobController');


router.get('/list/:referral_code', getReferralTree)
router.get('/full/:referral_code', getFullReferralTree)
router.get('/commission', calculateCommissionForAllUsers)
router.get('/roi', updateROIIncomeForUsers)
router.put('/self-trade/:id', processSelfTrade)
router.get('/latest/:userId', getLatestRoiDate)
router.get('/jobs', callAllFunctionsSequentially)



module.exports = router