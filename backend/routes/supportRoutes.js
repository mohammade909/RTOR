const express = require('express');
const router = express.Router()
const  {getListOfSupport,addSupport,updateSupport,deleteSupport,getListOfsingleSupport} = require('../controllers/supportController')


router.get('/list', getListOfSupport)
router.get('/by/:user_id', getListOfsingleSupport)
router.post('/add', addSupport)
router.route('/:id')
  .put(updateSupport)
  .delete(deleteSupport);

module.exports = router