const mongoose = require('mongoose');
const cardPaymentSchema = mongoose.Schema({
    "paymentDetails": {
        "requestId": {
            type: String,
        },
        "productCode":{
            type: String,
        },
        "amount": {
            type: String,
        },
        "currency": {
            type: String,
        },
        "locale": {
            type: String,
        },
        "orderInfo": {
            type: String,
        },
        "returnUrl": {
            type: String,
        },
    },
    "merchantDetails": {
        "accessCode": {
            type: String,
        },
        "merchantID": {
            type: String,
        },
        "secureSecret": {
            type: String,
        },
    },
    "secureHash": {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('cardPaymentSchema', cardPaymentSchema);