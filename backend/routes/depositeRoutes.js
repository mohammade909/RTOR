const express = require('express');
const router = express.Router()
const  {getListOfDeposite,addDeposite,updateDeposite,deleteDeposite,getListOfDepositeById, manualDeposit} = require('../controllers/depositeController')


router.get('/list', getListOfDeposite)
router.get('/by/:user_id', getListOfDepositeById)
router.post('/add', addDeposite)
router.post('/manual', manualDeposit)
router.route('/:id')
  .put(updateDeposite)
  .delete(deleteDeposite);

module.exports = router