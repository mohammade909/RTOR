const express = require('express');
const router = express.Router()
const  {getQrLink,addQrLink,deleteQrLink} = require('../controllers/qrController')


router.get('/', getQrLink)
router.post('/add', addQrLink)
router.route('/:id')
  .delete(deleteQrLink)

module.exports = router