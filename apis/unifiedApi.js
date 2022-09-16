let axios = require('axios');
const baseUrl = "https://developer.ecobank.com"
let accountOpening = require('../model/createAccountSchema')
let accountBalance = require('../model/balance')
let accountStatement = require('../model/statement')
let accountPayment = require('../model/payment')
let tokenSchema = require('../model/token')
let cardPayment = require('../model/cardPayment')
let  token = ""


//run function every 1 minute
//  function calltoeknApi(){
//     setInterval(function(){
//         getToken()
//     }, 60000)
//  }

 //auto run function every 1 minute
// calltoeknApi()

//token generation
exports.getToken = function (userId, password){
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
        token = response.data.token
        console.log(token);
    }).catch((err)=>{
        console.log(err);
    })
}

getsecureHarsh = function(){}


//opening express account
exports.createAccount = function ( firstName, lastname, mobileNo, gender, identityNo, identityType, IDIssueDate, IDExpiryDate, currency, country, branchCode, createdAt, country, email, city, state, street, address, token){
    // getToken(token)
    let accUrl = '/corporateapi/merchant/createexpressaccount'
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
     axios.post(baseUrl + accUrl, payload,{
         headers: {
            Origin: "developer.ecobank.com",
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization:"Bearer " + token
        }
     }).then((response)=>{
        console.log(response);
        //save response from the api service
        let account = new accountOpening()
        account.save((response, err)=>{
            if(err) {
                throw err
            }else{
                console.log('account open successfully', response)
            }
        });

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

