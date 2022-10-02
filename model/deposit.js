let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DepositSchema = new Schema({
    amount: {
        type: Number,
    },
    sendername: {
        type: String,
    },
    UserID: {
        type: String,
    },
    header:{
        type: Object,
    },
    created: {
        type: Date,
    }
})

module.exports = mongoose.model('Deposit', DepositSchema);