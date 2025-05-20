const express = require('express');
const router = express.Router()
const  { cto,getListOfCto,deletecto,payCto,getListOfCtoByid,payCtoMonthly,CtoMonthlyTransaction} = require('../controllers/ctoController')

router.get('/',cto)
router.put('/:id',deletecto)
router.get('/byid/:id',getListOfCtoByid)
router.get('/list',getListOfCto)
router.post('/pay',payCto)
router.get('/paymonthly',payCtoMonthly)
router.get('/transaction/:id',CtoMonthlyTransaction)



module.exports = router