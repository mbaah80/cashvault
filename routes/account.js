let express = require('express');
// let ecobank = require('../apis/unifiedApi');
const config = require("../config/keys");
let axios = require('axios');
const passport = require('passport');
const accountOpening = require("../model/createAccountSchema");
const accountStatement = require("../model/statement");
// const accountBalance = require("../model/balance");

let router = express.Router();


//opening express account
router.post('/createAccount', passport.authenticate('jwt', {session:false}),(req, res)=>{
  let bank = "ecobank";
   if (bank === 'ecobank'){
       try {
           let {bank, requestId,affiliateCode, firstName, lastname, mobileNo, gender, identityNo, identityType, IDIssueDate, IDExpiryDate, ccy, country, branchCode, datetime, countryOfResidence , email, city, state, street, secureHash} = req.body;
           let accUrl = '/corporateapi/merchant/createexpressaccount'
           let tokenUrl = '/corporateapi/user/token'
           let body = {
               "userId": config.userId,
               "password": config.password
           }
           let payload = {
               "bank": bank,
               "requestId": requestId, //+ UserId, will check user id first
               "affiliateCode": affiliateCode,
               "firstName": firstName,
               "lastname": lastname,
               "mobileNo": mobileNo,
               "gender": gender,
               "identityNo": identityNo,
               "identityType": identityType,
               "IDIssueDate": IDIssueDate,
               "IDExpiryDate": IDExpiryDate,
               "ccy": ccy,
               "country": country,
               "branchCode": branchCode,
               "datetime": datetime,
               "countryOfResidence": countryOfResidence,
               "email": email,
               "city": city,
               "state": state,
               "street": street,
               "secureHash": secureHash
           }
           axios.post(config.EcobankBaseUrl + tokenUrl, body,{
               headers: {
                   Origin: "developer.ecobank.com",
                   "Content-Type": "application/json",
                   Accept: "application/json",
               }
           }).then((response)=>{
                   if (response.data.token){
                       accountOpening.findOne({identityNo: identityNo} , (err, user)=>{
                           if (err){
                               console.log(err, 'error');
                               res.status(500).json({
                                      message: 'error',
                                        error: err
                               })
                           }
                           if (user){
                               res.status(200).json({
                                      message: 'user already exist',
                               })
                           }else{
                               axios.post(config.EcobankBaseUrl + accUrl, payload,{
                                   headers: {
                                       Origin: "developer.ecobank.com",
                                       "Content-Type": "application/json",
                                       Accept: "application/json",
                                       Authorization:"Bearer " + response.data.token
                                   }
                               }).then((response)=>{
                                   if(response.status === 403){
                                       res.status(403).json({
                                             message: 'forbidden',
                                       })
                                   }else if(response.status === 200){

                                       let account = new accountOpening({
                                           accountDetails: response.data,
                                           "bank": bank,
                                           "requestId": 'ECO76383823',
                                           "affiliateCode": affiliateCode,
                                           "firstName": firstName,
                                           "lastname": lastname,
                                           "mobileNo": mobileNo,
                                           "gender": gender,
                                           "identityNo": identityNo,
                                           "identityType": identityType,
                                           "IDIssueDate": IDIssueDate,
                                           "IDExpiryDate": IDExpiryDate,
                                           "ccy": ccy,
                                           "country": country,
                                           "branchCode": branchCode,
                                           "datetime": datetime,
                                           "countryOfResidence": countryOfResidence,
                                           "email": email,
                                           "city": city,
                                           "state": state,
                                           "street": street,
                                           "secureHash": secureHash,
                                           UserID: req.user._id
                                       })
                                       account.save().then((account)=>{
                                             res.status(200).json({
                                                  message: 'account created successfully',
                                                  account
                                             })
                                       }).catch((err)=>{
                                                res.status(500).json({
                                                    message: 'error',
                                                    error: err
                                                })
                                       })
                                       // statusText: 'OK',
                                   }else{
                                       res.status(500).json({
                                             message: 'error',
                                       })
                                   }

                               }).catch((err)=>{
                                      res.status(500).json({
                                        message: 'error',
                                        error: err
                                      })
                               })
                           }
                       })
                   }else{
                       console.log('token not yet in')
                   }
               }).catch((err)=>{
               console.log(err);
           })


       }
       catch (error) {
            res.status(500).json({
                message: error.message
            })
       }
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

//account balance
router.post('/accountBalance', passport.authenticate('jwt', {session:false}),(req, res)=>{
    let bank = "ecobank";
    if(bank === 'ecobank'){
        try {
            let {bank, requestId, affiliateCode, accountNo, clientId, companyName, secureHash} = req.body;
            let accbalanceurl = '/corporateapi/merchant/accountbalance'
            let tokenUrl = '/corporateapi/user/token'
            let payload = {
                bank: bank,
                "requestId": requestId,
                "affiliateCode": affiliateCode,
                "accountNo": accountNo,
                "clientId": clientId,
                "companyName": companyName,
                "secureHash": secureHash,
                userId: req.user._id
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
            }).then((response)=>{
                if (response.data.token){
                    axios.post(config.EcobankBaseUrl + accbalanceurl, payload,{
                        headers: {
                            Origin: "developer.ecobank.com",
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization:"Bearer " + response.data.token
                        }
                    }).then((response)=>{
                        res.status(200).json({
                            message: 'success',
                            response: response.data
                        })
                        // let balance = new accountBalance({
                        //                 bank: bank,
                        //                 "requestId": requestId,
                        //                 "affiliateCode": affiliateCode,
                        //                 "accountNo": accountNo,
                        //                 "clientId": clientId,
                        //                 "companyName": companyName,
                        //                 "secureHash": secureHash,
                        //                 userId: req.user._id
                        // })
                        // balance.save((balance, err)=>{
                        //     if(err) {
                        //         res.status(500).json({
                        //             message: 'error',
                        //         })
                        //     }else{
                        //         res.status(200).json({
                        //             message: 'success',
                        //             balance
                        //         })
                        //     }
                        // })
                    }).catch((err)=>{
                        res.status(500).json({
                            message: 'error',
                            error: err
                        })
                    })
                }else{
                    res.status(500).json({
                        message: 'error',
                    })
                }
            }).catch((err)=>{
                res.status(500).json({
                    message: 'error',
                    error: err
                })
            })
        }
        catch (error) {
            res.status(500).json({
                message: "internal server error",
                error: error
            })
        }
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

//account statement
router.post('/accountStatement', passport.authenticate('jwt', {session:false}),(req, res)=>{
    let bank = "ecobank";
    if(bank === 'ecobank'){
        try {
            let {bank, corporateId, affiliateCode, accountNumber, startDate, endDate,  secureHash,} = req.body;
            let accUrl = '/corporateapi/merchant/statement'
            let payload = {
                bank: bank,
                "corporateId": corporateId,
                "affiliateCode": affiliateCode,
                "accountNumber": accountNumber,
                "startDate": startDate,
                "endDate": endDate,
                "secureHash": secureHash
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
            }).then((response)=>{
                if (response){
                    axios.post(config.EcobankBaseUrl + accUrl, payload,{
                        headers: {
                            Origin: "developer.ecobank.com",
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization:"Bearer " + response.data.token
                        }
                    }).then((response)=>{
                        let statement = new accountStatement()
                        statement.save((statement, err)=>{
                            if(err) {
                                res.status(500).json({
                                    message: 'error',
                                    err: err
                                })
                            }else{
                                res.status(200).json({
                                    message: 'account statement retrieved successfully',
                                    statement
                                })
                            }
                        })
                    }).catch((err)=>{
                        res.status(500).json({
                            message: 'error',
                            err: err
                        })
                    })
                }

            }).catch((err)=>{
                console.log(err);
            })
        }
        catch (e) {
            res.status(500).json({
                message: "internal server error",
                error: e
            })
        }
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

//account enquiry
router.post('/accountEnquiry', (req, res)=>{
    let bank = "ecobank";
    if(bank === 'ecobank'){
        try {
            let {bank, requestId, affiliateCode, accountNo, clientId, companyName, secureHash} = req.body;
            let accenquiryurl = '/corporateapi/merchant/accountinquiry'
            let tokenUrl = '/corporateapi/user/token'
            let payload = {
                bank: bank,
                "requestId": requestId,
                "affiliateCode": affiliateCode,
                "accountNo": accountNo,
                "clientId": clientId,
                "companyName": companyName,
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
            }).then((response)=>{
                if (response.data.token){
                    axios.post(config.EcobankBaseUrl + accenquiryurl, payload,{
                        headers: {
                            Origin: "developer.ecobank.com",
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization:"Bearer " + response.data.token
                        }
                    }).then((response)=>{
                        res.status(200).json({
                            message: 'success',
                            response: response.data
                        })
                        // let balance = new accountBalance()
                        // balance.save((balance, err)=>{
                        //     if(err) {
                        //         res.status(500).json({
                        //             message: 'error',
                        //         })
                        //     }else{
                        //         res.status(200).json({
                        //             message: 'success',
                        //             balance
                        //         })
                        //     }
                        // })
                    }).catch((err)=>{
                        res.status(500).json({
                            message: 'error',
                            error: err
                        })
                    })
                }else{
                    res.status(500).json({
                        message: 'error',
                    })
                }
            }).catch((err)=>{
                res.status(500).json({
                    message: 'error',
                    error: err
                })
            })
        }
        catch (error) {
            res.status(500).json({
                message: "internal server error",
                error: error
            })
        }
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

//account transfer
router.post('/accountTransfer', passport.authenticate('jwt', {session:false}),(req, res)=>{
    let bank = "ecobank";
    if(bank === 'ecobank'){
        try {
            let {bank, requestId, affiliateCode, accountNo, clientId, companyName, destinationBankCode, secureHash} = req.body;
            let accTransfer = '/corporateapi/merchant/accountinquiry'
            let tokenUrl = '/corporateapi/user/token'
            let payload = {
                bank: bank,
                "requestId": requestId,
                "affiliateCode": affiliateCode,
                "accountNo": accountNo,
                "clientId": clientId,
                "companyName": companyName,
                "destinationBankCode": destinationBankCode,
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
            }).then((response)=>{
                if (response.data.token){
                    axios.post(config.EcobankBaseUrl + accTransfer, payload,{
                        headers: {
                            Origin: "developer.ecobank.com",
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization:"Bearer " + response.data.token
                        }
                    }).then((response)=>{
                        res.status(200).json({
                            message: 'success',
                            response: response.data
                        })
                        // let balance = new accountBalance()
                        // balance.save((balance, err)=>{
                        //     if(err) {
                        //         res.status(500).json({
                        //             message: 'error',
                        //         })
                        //     }else{
                        //         res.status(200).json({
                        //             message: 'success',
                        //             balance
                        //         })
                        //     }
                        // })
                    }).catch((err)=>{
                        res.status(500).json({
                            message: 'error',
                            error: err
                        })
                    })
                }else{
                    res.status(500).json({
                        message: 'error',
                    })
                }
            }).catch((err)=>{
                res.status(500).json({
                    message: 'error',
                    error: err
                })
            })
        }
        catch (error) {
            res.status(500).json({
                message: "internal server error",
                error: error
            })
        }
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