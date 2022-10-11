let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let mtnPaySchema = new Schema({
    "amount": {
        type: String,
    },
    "currency": {
        type: String,
    },
    "externalId": {
        type: String,
    },
    "partyIdType": {
        type: String,
    },
    "partyId": {
        type: String,
    },
    "payerMessage": {
        type: String
    },
    "payeeNote": {
        type: String
    },
    userId:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('mtnRequestToPay', mtnPaySchema);