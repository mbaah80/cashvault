let express = require('express');
const config = require("../config/keys");
const ecobank = require("../apis/unifiedApi");
const logger = require("../logger");

let router = express.Router();

router.post('/token', (req, res)=>{
    let bank = "ecobank";
   if (bank === 'ecobank'){
       try {
           let userId = config.userId;
           let password = config.password;
           let token = ecobank.getToken(userId, password);
           res.status(200).json({
               token: token, message: 'token generated successfully'
           })
       }catch (err){
           logger.error(err);
           res.status(500).json({  err:err,
               message: 'error generating token'
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