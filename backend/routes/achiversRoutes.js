const express = require('express');
const router = express.Router()
const  {getListOfAchivers,addAchivers,deleteAchivers} = require('../controllers/achiverController')


router.get('/list', getListOfAchivers)
router.post('/add', addAchivers)
router.delete('/:id',deleteAchivers);

module.exports = router