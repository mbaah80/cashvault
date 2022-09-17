let axios = require('axios');
const baseUrl = "https://developer.ecobank.com"
const config = require('../config/keys');
let accountOpening = require('../model/createAccountSchema')
let accountBalance = require('../model/balance')
let accountStatement = require('../model/statement')
let accountPayment = require('../model/payment')
let tokenSchema = require('../model/token')
let cardPayment = require('../model/cardPayment')
let transferSchema = require('../model/fundstransfer')
let transactionSchema = require('../model/transaction')
let momoPayment = require('../model/momoPayment')
let tokenEndpoint = ''



//run function every 1 minute
 function calltokenApi(){
    setInterval(function(){
        getToken(config.userId, config.password)
        console.log('token generated')
    }, 3000)
 }

 //auto run function every 1 minute
// calltokenApi()

//token generation
 getToken = function (userId, password){
    let tokenUrl = '/corporateapi/user/token'
    let payload = {
        "userId": userId,
        "password": password
    }
    axios.post(baseUrl + tokenUrl, payload,{
        headers: {
            Origin: "developer.ecobank.com",
            "Content-Type": "application/json",
            Accept: "application/json",
        }
    }).then((response)=>{
        if (response){
            tokenEndpoint = response.data.token
            console.log(tokenEndpoint, 'token function tokenEndpoint')
        //     let user = new tokenSchema({
        //         token: response.data.token
        //     })
        //     user.save((user, err)=>{
        //         if(err) {
        //             throw err
        //         }else{
        //             console.log('token saved successfully', user)
        //         }
        //     })
        // }else{
        //     console.log('token not yet in')
        // }
 }

    }).catch((err)=>{
        console.log(err);
    })
}


getsecureHarsh = function(){}


//opening express account
 exports.createAccount = function ( firstName, lastname, mobileNo, gender, identityNo, identityType, IDIssueDate, IDExpiryDate, currency, country, branchCode, createdAt, country, email, city, state, street, address){
     let accUrl = '/corporateapi/merchant/createexpressaccount'
     let tokenUrl = '/corporateapi/user/token'
     let body = {
         "userId": config.userId,
         "password": config.password
     }
     let payload = {
         "requestId": 'ECO76383823', //+ UserId, will check user id first
         "affiliateCode": "EGH",
         "firstName": firstName,
         "lastname": lastname,
         "mobileNo": mobileNo,
         "gender": gender,
         "identityNo": identityNo,
         "identityType": identityType,
         "IDIssueDate": IDIssueDate,
         "IDExpiryDate": IDExpiryDate,
         "ccy": currency,
         "country": country,
         "branchCode": "EGH",
         "datetime": createdAt,
         "countryOfResidence": address,
         "email": email,
         "city": city,
         "state": state,
         "street": street,
         "secureHash": "a43aa74662060b7b9c942dd7ace565a0919118db758bcd71a0f5c7cd7e349f6309b02866b6156ef9171a1b23119c71e77db2edd38cc89963d7f34b541d6dc461"
     }
     axios.post(baseUrl + tokenUrl, body,{
         headers: {
             Origin: "developer.ecobank.com",
             "Content-Type": "application/json",
             Accept: "application/json",
         }
     }).then((response)=>{
         if (response.data.token){
             axios.post(baseUrl + accUrl, payload,{
                 headers: {
                     Origin: "developer.ecobank.com",
                     "Content-Type": "application/json",
                     Accept: "application/json",
                     Authorization:"Bearer " + response.data.token
                 }
             }).then((response)=>{
                 if(response.status === 403){
                  console.log('Account already exist or invalid details', response.data)
                 }else if(response.status === 200){
                     console.log('Account created successfully', response.data)
                     let account = new accountOpening({
                         accountDetails: response.data,
                         userInformation: payload
                     })
                     account.save((response, err)=>{
                         if(err) {
                             throw err
                         }else{
                             console.log('account open successfully', response)
                         }
                     });
                     // statusText: 'OK',
                 }else{
                     console.log('Account not created')
                 }

             }).catch((err)=>{
                 console.log(err);
             })
         }else{
             console.log('token not yet in')
         }
     }).catch((err)=>{
         console.log(err);
     })
}

//account balance
exports.accountbalance = function (requestId,affiliateCode,accountNo, clientId, companyName, secureHash, token){
    getToken()
     let accUrl = '/corporateapi/merchant/accountbalance'
     let payload = {
          "requestId": requestId,
          "affiliateCode": affiliateCode,
          "accountNo": accountNo,
          "clientId": clientId,
          "companyName": companyName,
          "secureHash": secureHash
     }
      axios.post(baseUrl + accUrl, payload,{
          headers: {
                Origin: "developer.ecobank.com",
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization:"Bearer " + token
          }
      }).then((response)=>{
          let balance = new accountBalance()
            balance.save((balance, err)=>{
                if(err) {
                    throw err
                }else{
                    console.log('account balance successfully', balance)
                }
            })
      }).catct((err)=>{
          console.log(err);
      })

}

//account statement
exports.accountStatement = function (corporateId,affiliateCode,accountNumber, startDate, endDate, secureHash, token, userID){
    getToken()
    let accUrl = '/corporateapi/merchant/statement'
    let payload = {
        "corporateId": corporateId,
        "affiliateCode": affiliateCode,
        "accountNumber": accountNumber,
        "startDate": startDate,
        "endDate": endDate,
        "secureHash": secureHash
    }
    axios.post(baseUrl + accUrl, payload,{
        headers: {
            Origin: "developer.ecobank.com",
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:"Bearer " + token
        }
    }).then((response)=>{
        let statement = new accountStatement()
        statement.save((statement, err)=>{
            if(err) {
                throw err
            }else{
                console.log('account statement successfully', statement)
            }
        })
    }).catch((err)=>{
        console.log(err);
    })
}

//account payment
exports.accountPayment = function (affiliateCode, secureHash, clientid,amount,currency,rate_type, batchsequence,batchamount,transactionamount,batchid,transactioncount,batchcount, transactionid,debittype,totalbatches, execution_date, request_id, request_type, token ){
    getToken()
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
            "affiliateCode": "EGH",
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

    axios.post(baseUrl + accUrl, payload,{
        headers: {
            Origin: "developer.ecobank.com",
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:"Bearer " + token
        }
    }).then((response)=>{
        let payment = new accountPayment()
        payment.save((payment, err)=>{
            if(err) {
                throw err
            }else{
                console.log('account payment successfully', payment)
            }
        })
    }).catch((err)=>{
        console.log(err);
    })
}

//card payment
exports.cardPayment = function (requestId,productCode,amount,currency,locale,orderInfo,returnUrl,accessCode, merchantID, secureSecret, secureHash,token){
    getToken()
    let accUrl = '/corporateapi/merchant/Signature'
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
    axios.post(baseUrl + accUrl, payload,{
        headers: {
            Origin: "developer.ecobank.com",
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:"Bearer " + token
        }
    }).then((response)=>{
        let card = new cardPayment()
        card.save((card, err)=>{
            if(err) {
                throw err
            }else{
                console.log('card payment successfully', card)
            }
        })
    }).catch((err)=>{
        console.log(err);
    })
}

//momo payment
exports.momoPayment = function (affiliateCode,telco,channel,countryCode,transId,productCode,senderName,senderAccountNo, senderPhoneNumber, branch, transRef,bankref,receiverPhoneNumber,receiverFirstName,receiverLastName,receiverEmail,receiverBank,currency,amount,transDesc,transType,secureHash,token){
    getToken()
    let accUrl = '/corporateapi/merchant/momo'
    let payload = {
        "affiliateCode": affiliateCode,
        "telco": telco,
        "channel": channel,
        "token": token,
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
    axios.post(baseUrl + accUrl, payload,{
        headers: {
            Origin: "developer.ecobank.com",
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:"Bearer " + token
        }
    }).then((response)=>{
        console.log(response.data)
        let momoTransaction = new momoPayment()
        momoTransaction.save((momoTransaction, err)=>{
            if(err) {
                throw err
            }else{
                console.log('momo payment successfully', momoTransaction)
                accountBalance.findOneAndUpdate({accountNo: senderAccountNo}, {$inc: {balance: -amount}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }else{
                        console.log("account updated successfully", doc)
                    }
                })
            }
        })
    }).catch((err)=>{
        console.log(err);
    })
}

//transfer fund
exports.transferFund = function (clientId,clientSecret, partnerId,countryCode,transferType,requestId,sourceIp,externalRefNo,amount, currency, narration, transactionDate,accountName, bankCode, accountNo, accountType, token){
    let accUrl = '/enterprise-integration/e-eco-api/transfer'
    let payload = {
        "hostHeaderInfo": {
            "partnerId": partnerId,
            "countryCode": countryCode,
            "transferType": transferType,
            "requestId": requestId,
            "sourceIp": sourceIp
        },
        "transactionDetails": {
            "externalRefNo": externalRefNo,
            "amount": amount,
            "currency": currency,
            "narration": narration,
            "transactionDate": transactionDate,
            "beneficiary": {
                "accountName": accountName,
                "bankCode": bankCode,
                "accountNo": accountNo,
                "accountType": accountType
            }
        }
    }
    axios.post(baseUrl + accUrl, payload, {
        headers: {
            "x-client-secret": clientSecret,
            "Content-Type": "application/json",
            "x-client-id": clientId,
            "x-request-token": token
        }
    }).then((response)=>{
        console.log(response.data)
       let transfer = new transferSchema()
        transfer.save((transfer, err)=>{
            if(err) {
                throw err
            }else{
                console.log('transfer fund successfully', transfer)
                accountBalance.find({
                    accountNo: accountNo
                })
                    .then((balance)=>{
                        if(balance){
                            balance = balance - amount
                            balance.save()
                        }else{
                            console.log('balance not found or insufficient fund')
                        }
                    })
            }
        })
    }).catch((err)=>{
        console.log(err)
    })

}

//check transaction status
exports.transactionStatus = function(affiliateCode, sourceCode, accountNo, branchCode, clientId, clientSecret, token){
    let accUrl = '/enterprise-integration/e-eco-api/transaction/status'
    let payload = {
        "affiliateCode": affiliateCode,
        "sourceCode": sourceCode,
        "accountNo": accountNo,
        "branchCode": branchCode
    }
    axios.post(baseUrl + accUrl, payload, {
        headers: {
            "x-client-secret": clientSecret,
            "Content-Type": "application/json",
            "x-client-id": clientId,
            "x-request-token": token
        }
    }).then((response) =>{
        console.log(response.data)
    }).catch((err)=>{
        console.log(err)
    })
}
