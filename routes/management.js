let express = require('express');
let router = express.Router();
let config = require('../config/keys');
let passport = require('passport');

//loan management
router.post('/loanManagement',  passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send('loan management');
})

//insurance management
router.post('/insuranceManagement', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send('insurance management');
})

//savings management
router.post('/savingsManagement', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send('savings management');
})

//investment management
router.post('/investmentManagement', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send('investment management');
})

//pension management
router.post('/pensionManagement', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send('pension management');
})



module.exports = router;