let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let individualkycSchema = new Schema({
    userId: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    middleName: {
        type: String,
    },
    contact: {
        type: String,
    },
    ssNumber: {
        type: String,
    },
    employementStatus: {
        type: String,
    },
    employerName: {
        type: String,
    },
    idType: {
        type: String,
    },
    idNumber: {
        type: String,
    },
    idExpiry: {
        type: String,
    },
    idIssueDate: {
        type: String,
    },
    address: {
        type: String,
    },
    dob: {
        type: String,
    },
    identityImage: {
        type: String,
    },
    auditStatus: {
        type: String,
        default: 'Pending'
    },
    created: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('individual-kyc', individualkycSchema);