const express = require('express');
const router = express.Router()
const  {getListOfActPlans,getActPlanById,updateActPlan,deleteActPlan,addActPlan} = require('../controllers/actplanController')


router.get('/list', getListOfActPlans)
router.post('/add', addActPlan)
router.route('/:id')
  .get(getActPlanById)
  .put(updateActPlan)
  .delete(deleteActPlan);

module.exports = router