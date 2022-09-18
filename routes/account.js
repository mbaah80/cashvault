let express = require('express');
let ecobank = require('../apis/unifiedApi');

let router = express.Router();


//opening express account
router.post('/createaccount', (req, res)=>{
  let bank = "ecobank";
   if (bank === 'ecobank'){
       try {
           let {bank, requestId,affiliateCode, firstName, lastname, mobileNo, gender, identityNo, identityType, IDIssueDate, IDExpiryDate, ccy, country, branchCode, datetime, countryOfResidence , email, city, state, street, secureHash} = req.body;
           ecobank.createAccount(bank, requestId,affiliateCode, firstName, lastname, mobileNo, gender, identityNo, identityType, IDIssueDate, IDExpiryDate, ccy, country, branchCode,datetime, countryOfResidence, email, city, state, street, secureHash)
           if (ecobank.createAccount){
               res.send(ecobank.createAccount.response)
           }else{
                res.send("error")
           }

       }catch (error) {
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

router.post('/accountBalance', (req, res)=>{
    let bank = "ecobank";
    if(bank === 'ecobank'){
        let {requestId, affiliateCode, accountNo, clientId, companyName,  secureHash, token} = req.body;
        ecobank.accountbalance(requestId, affiliateCode, accountNo, clientId, companyName, secureHash, token);
        if (ecobank.accountbalance) {
            res.status(200).json({
                message: 'account balance retrieved successfully'
            })
        }else {
            res.status(500).json({
                message: 'error retrieving account balance'
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

router.post('/accountStatement', (req, res)=>{
    let bank = "ecobank";
    if(bank === 'ecobank'){
        let {corporateId, affiliateCode, accountNumber, startDate, endDate, secureHash, token} = req.body;
        ecobank.accountStatement(corporateId, affiliateCode, accountNumber, startDate, endDate ,secureHash, token);
        if (ecobank.accountStatement) {
            res.status(200).json({
                message: 'account statement retrieved successfully'
            })
        }else {
            res.status(500).json({
                message: 'error retrieving account statement'
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