const express = require('express');
const router = express.Router()
const  {getListOfUsers,getListOfNonUsers,getDefaulterReward,getUsersById,sendReward,updateUser,deleteUser,getUsersByEmail,getrewardList} = require('../controllers/usersController')


router.get('/list', getListOfUsers)
router.get('/non/users', getListOfNonUsers)
router.post('/send/reward', sendReward)
router.get('/get/defaulterreward/:id', getDefaulterReward)
router.get('/', getUsersByEmail)
router.get('/rewards', getrewardList)
router.route('/:id')
  .get(getUsersById)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router