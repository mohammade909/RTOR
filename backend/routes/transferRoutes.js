const express = require('express');
const router = express.Router()
const  {transfertouser,getTransfer,getTransferById,transfertoFriend} = require('../controllers/transferController')


router.post('/touser', transfertouser)
router.post('/friend', transfertoFriend)
router.get('/list', getTransfer)
router.get('/byid/:user_id', getTransferById)


module.exports = router