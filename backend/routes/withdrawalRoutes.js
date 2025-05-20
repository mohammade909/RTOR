const express = require('express');
const router = express.Router()
const  {getListOfWithdrawalRequest,addWithdrawalRequest,updateROIWithdrawalRequest,addROIWithdrawalRequest,updateWithdrawalRequest,debitAmount,deleteWithdrawalRequest,getListOfWithdrawalRequestById, processPrincipleWithdrawalRequest, updatePrincipleWithdrawalRequest, autoTransferToActive} = require('../controllers/withdrawalController')


router.get('/list', getListOfWithdrawalRequest)
router.get('/by/:user_id', getListOfWithdrawalRequestById)
router.get('/auto-transfer/:id', autoTransferToActive)
router.post('/add', addWithdrawalRequest)
router.post('/add/roiwithdrawal', addROIWithdrawalRequest)
router.post("/add/principle" , processPrincipleWithdrawalRequest)
router.route('/:id')
  .put(updateWithdrawalRequest)
  .delete(deleteWithdrawalRequest);
router.post("/debit" , debitAmount)
router.put("/update/roi/:id" , updateROIWithdrawalRequest)
router.put("/update/principle/:id" , updatePrincipleWithdrawalRequest)
module.exports = router