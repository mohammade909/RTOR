const express = require('express');
const router = express.Router()
const  {forgotPassword,resetPassword} = require('../controllers/forgotPass')


router.post('/forget', forgotPassword)
router.post('/reset', resetPassword)

module.exports = router