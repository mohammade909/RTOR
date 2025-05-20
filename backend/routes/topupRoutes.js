const express = require('express');
const router = express.Router()
const  {getListOfTopup,addTopup,updateTopup,deleteTopup,getListOfTopupById,addReTopup,entryActivate} = require('../controllers/topupController')


router.get('/list', getListOfTopup)
router.get('/by/:user_id', getListOfTopupById)
router.post('/add', addTopup)
router.post('/entry', entryActivate)
router.post('/addretopup', addReTopup)
router.route('/:id')
  .put(updateTopup)
  .delete(deleteTopup);

module.exports = router