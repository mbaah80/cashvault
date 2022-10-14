let express = require('express');
const passport = require("passport");
let config = require('../config/urls');
let axios = require('axios');
let router = express.Router();
let balance = require('../model/balance');
let mtnRequestToPay = require('../model/mtnRequestToPay');
let mtnRequestToWithdraw = require('../model/mtnRequestToWithdraw');


//AccountBalance
router.get('/accountbalance', passport.authenticate('jwt', { session: false }), (req, res) => {
 let url = 'v1_0/account/balance';
 let headers = {
        'Authorization': 'Basic ' + req.user.token,
        'Ocp-Apim-Subscription-Key': config.mtnPrimaryKey,
        'X-Target-Environment': 'sandbox'
 }
 axios.get(config.mtnBaseUrl + url, { headers: headers })
        .then(response => {
            res.json(response.data);
            let bal = new balance({
             balance: response.data.availableBalance,
                currency: response.data.currency,
                UserID: req.user._id,
            })
            bal.save((err, bal) => {
                if (err) {
                    res.json(err);
                }
                res.json(bal);
            })
        })
        .catch(error => {
            res.json(error.response.data);
        })
})

//RequesttoPayTransactionStatus
router.get('/transactionStatus/:referenceId', passport.authenticate('jwt', { session: false }), (req, res) =>{
    let url = 'v1_0/requesttopay/' + req.params.referenceId
    let headers = {
        'Authorization': 'Basic ' + req.user.token,
        'X-Target-Environment': 'sandbox',
        'Ocp-Apim-Subscription-Key': config.mtnPrimaryKey
    }
    axios.get(config.mtnBaseUrl + url, { headers: headers })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.json(error.response.data);
        })
})

//RequestToWithdrawTransactionStatus
router.get('/WithdrawTransactionStatus/:referenceId', passport.authenticate('jwt', { session: false }), (req, res) =>{
    let url = 'v1_0/requesttowithdraw/' + req.params.referenceId
    let headers = {
        // 'referenceId': req.params.referenceId,
        'Authorization': 'Basic ' + req.user.token,
        'X-Target-Environment': 'sandbox',
        'Ocp-Apim-Subscription-Key': config.mtnApiKey
    }
    axios.get(config.mtnBaseUrl + url, { headers: headers })
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.json(error.response.data);
        })
})


//Request to Pay
router.post('/requestToPay', (req, res) => {
    try {
        let {amount, currency, externalId, partyIdType, partyId, payerMessage, payeeNote} = req.body
        let url ='v1_0/requesttopay'
        let payload = {
            "amount": amount,
            "currency": currency,
            "externalId": externalId,
            "payer": {
                "partyIdType": partyIdType,
                "partyId": partyId
            },
            "payerMessage": payerMessage,
            "payeeNote": payeeNote
        }

        axios.post(config.mtnBaseUrl + 'token', null,{
            headers: {
                'Authorization': 'Basic ' + Buffer.from(config.Username + ':' + config.Password).toString('base64'),
                'X-Target-Environment': 'sandbox',
                'Ocp-Apim-Subscription-Key': config.mtnPrimaryKey
            }
        }).then((response) => {
                console.log(response.data, 'token')
                res.status(200).json({data: response.data})
                axios.post(config.mtnBaseUrl + url, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + response.data.access_token,
                        'X-Reference-Id': externalId,
                        'X-Target-Environment': 'sandbox',
                        'Ocp-Apim-Subscription-Key': config.mtnPrimaryKey
                    }
                })
                .then(response => {
                    res.status(200).json({data: response.data})
                    let pay = new mtnRequestToPay({
                        amount: amount,
                        currency: currency,
                        externalId: externalId,
                        partyIdType: partyIdType,
                        partyId: partyId,
                        payerMessage: payerMessage,
                        payeeNote: payeeNote,
                    })
                    pay.save((err, pay) => {
                        if (err) {
                            res.status(400).json({error: err})
                        }
                        if(pay){
                            res.status(200).json({data: pay, message: 'Request to pay successful'})
                        }
                    })
                })
                .catch(error => {
                    res.status(401).json({error: error.response.data})
                })
        }).catch(error => {
            res.status(401).json({error: error})
        })
    }
    catch (error) {
        res.status(401).json({error: error})
    }
})

//Request to Withdraw
router.post('/requestToWithdraw', passport.authenticate('jwt', {session:false}),(req, res) => {
    try {
        let {amount, currency, externalId, partyIdType, partyId, payerMessage, payeeNote} = req.body
        let url ='v1_0/requesttowithdraw'
        let tokenUrl = 'token'
        let payload = {
            "amount": amount,
            "currency": currency,
            "externalId": externalId,
            "payer": {
                "partyIdType": partyIdType,
                "partyId": partyId
            },
            "payerMessage": payerMessage,
            "payeeNote": payeeNote
        }

        axios.post(config.mtnBaseUrl + tokenUrl, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(config.Username + ':' + config.Password).toString('base64'),
                'Ocp-Apim-Subscription-Key': config.mtnPrimaryKey,
            }
        })
            .then((response) => {
                axios.post(config.mtnBaseUrl + url, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + response.data.access_token,
                        'X-Reference-Id': externalId,
                        'X-Target-Environment': 'sandbox',
                        'Ocp-Apim-Subscription-Key': config.mtnPrimaryKey
                    }
                })
                    .then(response => {
                        let withdraw = new mtnRequestToWithdraw({
                            amount: amount,
                            currency: currency,
                            externalId: externalId,
                            partyIdType: partyIdType,
                            partyId: partyId,
                            payerMessage: payerMessage,
                            payeeNote: payeeNote,
                        })
                        withdraw.save((err, pay) => {
                            if (err) {
                                res.status(400).json({error: err})
                            }
                            if(pay){
                                res.status(200).json({data: pay, message: 'Request to withdraw successful'})
                            }
                        })
                    })
                    .catch(error => {
                        res.json(error.response.data)
                    })
            })
    }catch (error) {
        console.log(error);
    }
})



module.exports = router;