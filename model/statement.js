const mongoose = require('mongoose');
const accountStatementSchema = mongoose.Schema({
    corporateId:{
        type: String,
    },
    affiliateCode:{
        type: String,
    },
    accountNumber:{
        type: String,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    secureHash: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('AccountStatement', accountStatementSchema);