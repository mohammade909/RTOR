const express = require('express');
const router = express.Router()
const  {getListOfNews,getNewsById,updateNews,deleteNews,addNews} = require('../controllers/newsController')


router.get('/list', getListOfNews)
router.post('/add', addNews)
router.route('/:id')
  .get(getNewsById)
  .put(updateNews)
  .delete(deleteNews);

module.exports = router