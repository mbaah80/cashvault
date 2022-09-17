let mongoose = require('mongoose')

let fundstransferSchema = new mongoose.Schema({
    "hostHeaderInfo": {
        "partnerId": {
            type:String
        },
        "countryCode": {
            type:String
        },
        "transferType": {
            type:String
        },
        "requestId": {
            type:String
        },
        "sourceIp": {
            type:String
        }
    },
    "transactionDetails": {
        "externalRefNo": {
            type:String
        },
        "amount": {
            type:String
        },
        "currency": {
            type:String
        },
        "narration": {
            type:String
        },
        "transactionDate": {
            type:String
        },
        "beneficiary": {
            "accountName": {
                type:String
            },
            "bankCode": {
                type:String
            },
            "accountNo": {
                type:String
            },
            "accountType": {
                type:String
            }
        }
    }
})

module.exports = mongoose.model('fundstransferSchema', fundstransferSchema)