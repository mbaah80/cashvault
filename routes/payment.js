let express = require('express');
let router = express.Router();
let config = require('../config/keys');
let axios = require('axios');
const accountPayment = require("../model/payment");
const passport = require("passport");

//account payment
router.post('/payment', passport.authenticate('jwt', {session:false}),(req, res) => {
   let bank = req.body.bank;
   if(bank === "ecobank"){
       let {affiliateCode, secureHash, clientid,amount,currency,rate_type, batchsequence,batchamount,transactionamount,batchid,transactioncount,batchcount, transactionid,debittype,totalbatches, execution_date, request_id, request_type} = req.body;
       let accUrl = '/corporateapi/merchant/payment'
       let payload = {
           "secureHash": secureHash,
           "paymentHeader": {
               "clientid": clientid,
               "batchsequence": batchsequence,
               "batchamount": batchamount,
               "transactionamount": transactionamount,
               "batchid": batchid,
               "transactioncount": transactioncount,
               "batchcount": batchcount,
               "transactionid": transactionid,
               "debittype": debittype,
               "affiliateCode": affiliateCode,
               "totalbatches": totalbatches,
               "execution_date": execution_date
           },
           "extension": [
               {
                   "request_id": request_id,
                   "request_type": request_type,
                   // "param_list": "[" +
                   //     "{\"key\":\"creditAccountNo\", \"value\":\"1441001996321\"}," +
                   //     "{\"key\":\"debitAccountBranch\", \"value\":\"ACCRA\"}," +
                   //     "{\"key\":\"debitAccountType\", \"value\":\"Corporate\"}," +
                   //     "{\"key\":\"creditAccountBranch\", \"Accra\":\"GHS\"}," +
                   //     "{\"key\":\"creditAccountType\", \"value\":\"Corporate\"}," +
                   //     "{\"key\":\"amount\", \"value\":\"10\"},{\"key\":\"ccy\", \"value\":\"GHS\"}]",
                   "amount": amount,
                   "currency": currency,
                   "status": "",
                   "rate_type": rate_type
               },
           ],
       }
       let tokenUrl = '/corporateapi/user/token'
       let body = {
           "userId": config.userId,
           "password": config.password
       }
       axios.post(config.EcobankBaseUrl + tokenUrl, body,{
           headers: {
               Origin: "developer.ecobank.com",
               "Content-Type": "application/json",
               Accept: "application/json",
           }
       })
           .then((response)=>{
               if (response){
                   axios.post(config.EcobankBaseUrl + accUrl, payload,{
                       headers: {
                           Origin: "developer.ecobank.com",
                           "Content-Type": "application/json",
                           Accept: "application/json",
                           Authorization:"Bearer " + response.data.token
                       }
                   })
                       .then((response)=>{
                           let payment = new accountPayment()
                           payment.save((payment, err)=>{
                               if(err) {
                                   res.status(500).json({
                                       message: "Error saving payment",
                                       error: err
                                   })
                               }else{
                                   res.status(200).json({
                                       message: "account payment successfully",
                                       data: payment
                                   })
                               }
                           })
                       })
                       .catch((err)=>{
                           res.status(400).json({
                               message: "internal server error",
                               error: err
                           })
                       })
               }else{
                   res.status(400).json({
                       message: "internal server error"
                   })
               }
           })
           .catch((err)=>{
               res.send(err)
           })
   }
   else if (bank === 'zenith') {
       //zenith bank api
   } else if (bank === 'gtbank') {
       //gtbank api
   }else if (bank === 'access') {
       //access bank api
   } else if (bank === 'firstbank') {
       //firstbank api
   } else if (bank === 'unionbank') {
       //unionbank api
   } else if (bank === 'standardChartered') {
       //standard chartered bank api
   } else{
       //telecom api
   }
})

//card payment
router.post('/cardPayment', passport.authenticate('jwt', {session:false}),(req, res) => {
    let bank = req.body.bank;
    if(bank === "ecobank"){
        let {requestId,productCode,amount,currency,locale,orderInfo,returnUrl,accessCode, merchantID, secureSecret, secureHash} = req.body;
        let accUrl = '/corporateapi/merchant/Signature'
        let tokenUrl = '/corporateapi/user/token'
        let payload = {
            "paymentDetails": {
                "requestId": requestId,
                "productCode":productCode,
                "amount": amount,
                "currency": currency,
                "locale": locale,
                "orderInfo": orderInfo,
                "returnUrl": returnUrl,
            },
            "merchantDetails": {
                "accessCode": accessCode,
                "merchantID": merchantID,
                "secureSecret": secureSecret,
            },
            "secureHash": secureHash
        }
        let body = {
            "userId": config.userId,
            "password": config.password
        }
        axios.post(config.EcobankBaseUrl + tokenUrl, body,{
            headers: {
                Origin: "developer.ecobank.com",
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
            .then((response)=>{
                if (response){
                    axios.post(config.EcobankBaseUrl + accUrl, payload,{
                        headers: {
                            Origin: "developer.ecobank.com",
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization:"Bearer " + response.data.token
                        }
                    })
                        .then((response)=>{
                            let payment = new accountPayment()
                            payment.save((payment, err)=>{
                                if(err) {
                                    res.status(500).json({
                                        message: "Error saving payment",
                                        error: err
                                    })
                                }else{
                                    res.status(200).json({
                                        message: "account payment successfully",
                                        data: payment
                                    })
                                }
                            })
                        })
                        .catch((err)=>{
                            res.status(400).json({
                                message: "internal server error",
                                error: err
                            })
                        })
                }else{
                    res.status(400).json({
                        message: "internal server error"
                    })
                }
            })
            .catch((err)=>{
                res.send(err)
            })
    }
    else if (bank === 'zenith') {
        //zenith bank api
    } else if (bank === 'gtbank') {
        //gtbank api
    }else if (bank === 'access') {
        //access bank api
    } else if (bank === 'firstbank') {
        //firstbank api
    } else if (bank === 'unionbank') {
        //unionbank api
    } else if (bank === 'standardChartered') {
        //standard chartered bank api
    } else{
        //telecom api
    }
})

//momo payment
router.post('/momoPayment', passport.authenticate('jwt', {session:false}),(req, res) => {
    let bank = req.body.bank;
    if(bank === "ecobank"){
        let {affiliateCode,telco,channel,countryCode,transId,productCode,senderName,senderAccountNo, senderPhoneNumber, branch, transRef,bankref,receiverPhoneNumber,receiverFirstName,receiverLastName,receiverEmail,receiverBank,currency,amount,transDesc,transType,secureHash} = req.body;
        let accUrl = '/corporateapi/merchant/momo'
        let tokenUrl = '/corporateapi/user/token'
        let payload = {
            "affiliateCode": affiliateCode,
            "telco": telco,
            "channel": channel,
            "content": {
                "countryCode": countryCode,
                "transId": transId,
                "productCode": productCode,
                "senderName": senderName,
                "senderAccountNo": senderAccountNo,
                "senderPhoneNumber": senderPhoneNumber,
                "branch": branch,
                "transRef": transRef,
                "bankref": bankref,
                "receiverPhoneNumber": receiverPhoneNumber,
                "receiverFirstName": receiverFirstName,
                "receiverLastName": receiverLastName,
                "receiverEmail": receiverEmail,
                "receiverBank": receiverBank,
                "currency": currency,
                "amount": amount,
                "transDesc": transDesc,
                "transType": transType
            },
            "secureHash": secureHash
        }
        let body = {
            "userId": config.userId,
            "password": config.password
        }
        axios.post(config.EcobankBaseUrl + tokenUrl, body,{
            headers: {
                Origin: "developer.ecobank.com",
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
            .then((response)=>{
                if (response){
                    axios.post(config.EcobankBaseUrl + accUrl, payload,{
                        headers: {
                            Origin: "developer.ecobank.com",
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization:"Bearer " + response.data.token
                        }
                    })
                        .then((response)=>{
                            let payment = new accountPayment()
                            payment.save((payment, err)=>{
                                if(err) {
                                    res.status(500).json({
                                        message: "Error saving payment",
                                        error: err
                                    })
                                }else{
                                    res.status(200).json({
                                        message: "momo payment successfully",
                                        data: payment
                                    })
                                }
                            })
                        })
                        .catch((err)=>{
                            res.status(400).json({
                                message: "internal server error",
                                error: err
                            })
                        })
                }else{
                    res.status(400).json({
                        message: "internal server error"
                    })
                }
            })
            .catch((err)=>{res.send(err)})
    }
    else if (bank === 'zenith') {
        //zenith bank api
    } else if (bank === 'gtbank') {
        //gtbank api
    }else if (bank === 'access') {
        //access bank api
    } else if (bank === 'firstbank') {
        //firstbank api
    } else if (bank === 'unionbank') {
        //unionbank api
    } else if (bank === 'standardChartered') {
        //standard chartered bank api
    } else{
        //telecom api
    }
})

//fund transfer
router.post('/fundTransfer', passport.authenticate('jwt', {session:false}),(req, res) => {
    let bank = req.body.bank;
    if(bank === "ecobank"){
        let {clientId,clientSecret, affiliateCode,telco,channel,countryCode,transId,productCode,senderName,senderAccountNo, senderPhoneNumber, branch, transRef,bankref,receiverPhoneNumber,receiverFirstName,receiverLastName,receiverEmail,receiverBank,currency,amount,transDesc,transType,secureHash} = req.body;
        let accUrl = '/enterprise-integration/e-eco-api/transfer'
        let tokenUrl = '/corporateapi/user/token'
        let payload = {
            "affiliateCode": affiliateCode,
            "telco": telco,
            "channel": channel,
            "content": {
                "countryCode": countryCode,
                "transId": transId,
                "productCode": productCode,
                "senderName": senderName,
                "senderAccountNo": senderAccountNo,
                "senderPhoneNumber": senderPhoneNumber,
                "branch": branch,
                "transRef": transRef,
                "bankref": bankref,
                "receiverPhoneNumber": receiverPhoneNumber,
                "receiverFirstName": receiverFirstName,
                "receiverLastName": receiverLastName,
                "receiverEmail": receiverEmail,
                "receiverBank": receiverBank,
                "currency": currency,
                "amount": amount,
                "transDesc": transDesc,
                "transType": transType
            },
            "secureHash": secureHash
        }
        let body = {
            "userId": config.userId,
            "password": config.password
        }
        axios.post(config.EcobankBaseUrl + tokenUrl, body,{
            headers: {
                Origin: "developer.ecobank.com",
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
            .then((response)=>{
                if (response){
                    axios.post(config.EcobankBaseUrl + accUrl, payload,{
                        headers: {
                            "x-client-secret": clientSecret,
                            "Content-Type": "application/json",
                            "x-client-id": clientId,
                            "x-request-token": response.data.token
                        }
                    })
                        .then((response)=>{
                            let payment = new accountPayment()
                            payment.save((payment, err)=>{
                                if(err) {
                                    res.status(500).json({
                                        message: "Error saving payment",
                                        error: err
                                    })
                                }else{
                                    res.status(200).json({
                                        message: "momo payment successfully",
                                        data: payment
                                    })
                                }
                            })
                        })
                        .catch((err)=>{
                            res.status(400).json({
                                message: "internal server error",
                                error: err
                            })
                        })
                }else{
                    res.status(400).json({
                        message: "internal server error"
                    })
                }
            })
            .catch((err)=>{res.send(err)})
    }
    else if (bank === 'zenith') {
        //zenith bank api
    } else if (bank === 'gtbank') {
        //gtbank api
    }else if (bank === 'access') {
        //access bank api
    } else if (bank === 'firstbank') {
        //firstbank api
    } else if (bank === 'unionbank') {
        //unionbank api
    } else if (bank === 'standardChartered') {
        //standard chartered bank api
    } else{
        //telecom api
    }
})

//transaction status
router.post('/transactionStatus', passport.authenticate('jwt', {session:false}),(req, res) => {
    let bank = req.body.bank;
    if(bank === "ecobank"){
        let {affiliateCode, sourceCode, accountNo, branchCode, clientId, clientSecret} = req.body;
        let accUrl = '/enterprise-integration/e-eco-api/transaction/status'
        let tokenUrl = '/corporateapi/user/token'
        let payload = {
            "affiliateCode": affiliateCode,
            "sourceCode": sourceCode,
            "accountNo": accountNo,
            "branchCode": branchCode,
        }
        let body = {
            "userId": config.userId,
            "password": config.password
        }
        axios.post(config.EcobankBaseUrl + tokenUrl, body,{
            headers: {
                Origin: "developer.ecobank.com",
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
            .then((response)=>{
                if (response){
                    axios.post(config.EcobankBaseUrl + accUrl, payload,{
                        headers: {
                            "x-client-secret": clientSecret,
                            "Content-Type": "application/json",
                            "x-client-id": clientId,
                            "x-request-token": response.data.token
                        }
                    })
                        .then((response)=>{
                            res.status(200).json({
                                message: "transaction gone through successfully",
                            })
                            // let payment = new accountPayment()
                            // payment.save((payment, err)=>{
                            //     if(err) {
                            //         res.status(500).json({
                            //             message: "Error saving payment",
                            //             error: err
                            //         })
                            //     }else{
                            //         res.status(200).json({
                            //             message: "momo payment successfully",
                            //             data: payment
                            //         })
                            //     }
                            // })
                        })
                        .catch((err)=>{
                            res.status(400).json({
                                message: "transaction failed",
                                error: err
                            })
                        })
                }else{
                    res.status(400).json({
                        message: "internal server error"
                    })
                }
            })
            .catch((err)=>{res.send(err)})
    }
    else if (bank === 'zenith') {
        //zenith bank api
    } else if (bank === 'gtbank') {
        //gtbank api
    }else if (bank === 'access') {
        //access bank api
    } else if (bank === 'firstbank') {
        //firstbank api
    } else if (bank === 'unionbank') {
        //unionbank api
    } else if (bank === 'standardChartered') {
        //standard chartered bank api
    } else{
        //telecom api
    }
})

//cash deposit
router.post('/cashDeposit', passport.authenticate('jwt', {session:false}),(req, res) => {
    let bank = req.body.bank;
    if(bank === "ecobank"){
        let tokenUrl = '/corporateapi/user/token'
        let accUrl = '/agencybanking/services/thirdpartyagencybanking/cashin'
        let {sendername, sourceCode, subagentcode, senderphone,senderaccount, thirdpartyphonenumber, ccy, narration, amount, requestId, affcode,sourceIp,channel,requesttype,agentcode } = req.body;
        let body = {
            "userId": config.userId,
            "password": config.password
        }

        axios.post(config.EcobankBaseUrl + tokenUrl, body,{
            headers: {
                Origin: "developer.ecobank.com",
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
            .then((response)=>{
                if (response){
                    let payload = {
                        "sendername": sendername,
                        "subagentcode": subagentcode,
                        "senderphone": senderphone,
                        "senderaccount": senderaccount,
                        "thirdpartyphonenumber": thirdpartyphonenumber,
                        "ccy": ccy,
                        "narration": narration,
                        "amount": amount,
                        "transactiontoken": response.data.token,
                        "header": {
                            "affcode": affcode,
                            "requestId": requestId,
                            "requestToken": response.data.token,
                            "sourceCode": sourceCode,
                            "sourceIp": sourceIp,
                            "channel": channel,
                            "requesttype": requesttype,
                            "agentcode": agentcode
                        }
                    }
                    axios.post(config.thirdpartyUrl + accUrl, payload,{
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                        .then((response)=>{
                            res.status(200).json({
                                message: "transaction gone through successfully",
                            })
                            // let payment = new accountPayment()
                            // payment.save((payment, err)=>{
                            //     if(err) {
                            //         res.status(500).json({
                            //             message: "Error saving payment",
                            //             error: err
                            //         })
                            //     }else{
                            //         res.status(200).json({
                            //             message: "momo payment successfully",
                            //             data: payment
                            //         })
                            //     }
                            // })
                        })
                        .catch((err)=>{
                            res.status(400).json({
                                message: "transaction failed",
                                error: err
                            })
                        })
                }else{
                    res.status(400).json({
                        message: "internal server error"
                    })
                }
            })
            .catch((err)=>{res.send(err)})

    }
    else if (bank === 'zenith') {
        //zenith bank api
    } else if (bank === 'gtbank') {
        //gtbank api
    }else if (bank === 'access') {
        //access bank api
    } else if (bank === 'firstbank') {
        //firstbank api
    } else if (bank === 'unionbank') {
        //unionbank api
    } else if (bank === 'standardChartered') {
        //standard chartered bank api
    } else{
        //telecom api
    }
})

//self transfer
router.post('/selfTransfer', passport.authenticate('jwt', {session:false}),(req, res) => {
    let bank = req.body.bank;
    if(bank === "ecobank"){
        let tokenUrl = '/corporateapi/user/token'
        let accUrl = '/agencybanking/services/thirdpartyagencybanking/selftransfer'
        let {sourceaccount, destinationaccount, ccy, amount, requestId, sourceCode, affcode,sourceIp,channel,requesttype,agentcode } = req.body;
        let body = {
            "userId": config.userId,
            "password": config.password
        }

        axios.post(config.EcobankBaseUrl + tokenUrl, body,{
            headers: {
                Origin: "developer.ecobank.com",
                "Content-Type": "application/json",
                Accept: "application/json",
            }
        })
            .then((response)=>{
                if (response){
                    let payload = {
                        "sourceaccount": sourceaccount,
                        "destinationaccount": destinationaccount,
                        "ccy": ccy,
                        "amount": amount,
                        "transactiontoken": response.data.token,
                        "header": {
                            "affcode": affcode,
                            "requestId": requestId,
                            "requestToken": response.data.token,
                            "sourceCode": sourceCode,
                            "sourceIp": sourceIp,
                            "channel": channel,
                            "requesttype": requesttype,
                            "agentcode": agentcode
                        }
                    }
                    axios.post(config.thirdpartyUrl + accUrl, payload,{
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                        .then((response)=>{
                            res.status(200).json({
                                message: "transaction gone through successfully",
                            })
                            // let payment = new accountPayment()
                            // payment.save((payment, err)=>{
                            //     if(err) {
                            //         res.status(500).json({
                            //             message: "Error saving payment",
                            //             error: err
                            //         })
                            //     }else{
                            //         res.status(200).json({
                            //             message: "momo payment successfully",
                            //             data: payment
                            //         })
                            //     }
                            // })
                        })
                        .catch((err)=>{
                            res.status(400).json({
                                message: "transaction failed",
                                error: err
                            })
                        })
                }else{
                    res.status(400).json({
                        message: "internal server error"
                    })
                }
            })
            .catch((err)=>{res.send(err)})

    }
    else if (bank === 'zenith') {
        //zenith bank api
    } else if (bank === 'gtbank') {
        //gtbank api
    }else if (bank === 'access') {
        //access bank api
    } else if (bank === 'firstbank') {
        //firstbank api
    } else if (bank === 'unionbank') {
        //unionbank api
    } else if (bank === 'standardChartered') {
        //standard chartered bank api
    } else{
        //telecom api
    }
})




module.exports = router;