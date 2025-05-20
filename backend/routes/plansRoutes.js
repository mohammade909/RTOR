const express = require('express');
const router = express.Router()
const  {getListOfPlans,getPlanById,updatePlan,deletePlan,addPlan,addInvestLevel} = require('../controllers/plansController')


router.get('/list', getListOfPlans)
router.post('/add', addPlan)
router.post('/addinvestlevel', addInvestLevel)
router.route('/:id')
  .get(getPlanById)
  .put(updatePlan)
  .delete(deletePlan);

module.exports = router