const mongoose = require('mongoose');
const accountBalanceSchema = mongoose.Schema({
    "requestId": {
        type: String,
    },
    "affiliateCode": {
        type: String,
    },
    "accountNo": {
        type: String,
    },
    "clientId": {
        type: String,
    },
    "companyName": {
        type: String,
    },
    "secureHash": {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('AccountBalance', accountBalanceSchema);