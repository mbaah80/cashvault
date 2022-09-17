let mongoose = require('mongoose')

let transactionSchema = new mongoose.Schema({
    transactionId:{
        type:String
    },
    transactionType:{
        type: String
    },
    transactionDescription:{
        type: String
    },
    transactionDate:{
      type: String
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})
module.exports = mongoose.model('transactionSchema', transactionSchema)