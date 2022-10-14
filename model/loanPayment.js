let mongoose = require('mongoose');
let schema = mongoose.Schema;

let loanPaymentSchema = new schema({
   amount: {
        type: Number,
   },
    channel: {
        type: String,
    },
    accNumber: {
        type: String,
    },
    transactionId: {
        type: String,
    },
    network: {
        type: String,
    },
    userId: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('LoanPayment', loanPaymentSchema);