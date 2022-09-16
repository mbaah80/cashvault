const mongoose = require('mongoose');
const accountPaymentSchema = mongoose.Schema({
    "clientid": {
        type: String,
    },
    "batchsequence":{
        type: String,
    },
    "batchamount": {
        type: String,
    },
    "transactionamount": {
        type: String,
    },
    "batchid": {
        type: String,
    },
    "transactioncount": {
        type: String,
    },
    "batchcount": {
        type: String,
    },
    "transactionid": {
        type: String,
    },
    "debittype": {
        type: String,
    },
    "affiliateCode": {
        type: String,
        default: "EGH"
    },
    "totalbatches": {
        type: String,
    },
    "execution_date": {
        type: String,
    },
    "request_id": {
        type: String,
    },
    "request_type": {
        type: String,
    },
    "amount": {
        type: String,
    },
    "currency": {
        type: String,
    },
    "status": {
        type: String,
        default: "pending"
    },
    "rate_type": {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('accountPayment', accountPaymentSchema);