let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let businesskycSchema = new Schema({
     userId: {
            type: String,
     },
    businessName: {
            type: String,
    },
    businessAddress: {
            type: String,
    },
    businessContact: {
            type: String,
    },
    businessEmail: {
            type: String,
    },
    businessType: {
        type: String,
    },
    businessTin:{
         type: String
    },
    businessRegNumber: {
        type: String,
    },
    businessRegDate: {
        type: String,
    },
    businessCertificate: {
        type: String,
    },
    businessOwner: {
        type: String,
    },
    businessOwnerAddress: {
        type: String,
    },
    businessOwnerContact: {
        type: String,
    },
    businessOwnerEmail: {
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
module.exports = mongoose.model('business-kyc', businesskycSchema);