let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RequestLoanSchema = new Schema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    loanAmount: {
        type: Number,
    },
    repaymentAmount: {
        type: Number,
    },
    loanTerm: {
        type: Number,
    },
    loanPurpose: {
        type: String,
    },
    loanStatus: {
        type: String,
        default: 'Pending'
    },
    loanType: {
        type: String,
    },
    loanRate: {
        type: Number,
    },
    loanMonthlyPayment: {
        type: Number,
    },
    loanInterest: {
        type: Number,
    },
    userId: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('RequestLoan', RequestLoanSchema);