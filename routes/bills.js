let express = require('express');
let router = express.Router();
let config = require('../config/keys');
let passport = require("passport");


router.post('/buyairtime', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send('buy airtime');
})

router.post('/buydata', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send('buy data');
})

router.post('/paybill', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send('pay bill');
})

router.post('/waterbill', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send('water bill');
})

router.post('/electricitybill', passport.authenticate('jwt', {session:false}), (req, res)=>{
    res.send('electricity bill');
})

router.post('/tvbill', passport.authenticate('jwt', {session:false}), (req, res)=>{
    let tvType = req.body.tvType;
    if(tvType === 'dstv'){
        res.send('dstv bill');
    }else if(tvType === 'gotv'){
        res.send('gotv bill');
    } else if(tvType === 'startimes'){
        res.send('startimes bill');
    }else {
        res.send('invalid tv type');
    }
})




module.exports = router;