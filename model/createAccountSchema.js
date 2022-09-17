const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
      accountDetails:{
          type: Object
      },
    userInformation:{
        type: Object
    },
    //     response_message: {
    //         type: String,
    //     },
    //   sourceCode: {
    //             type: String,
    //         },
    //  responseCode: {
    //             type: String,
    //         },
    //         responseMessage: {
    //             type: String,
    //         },
    //     shortname: {
    //         type: String,
    //     },
    //     accountNo: {
    //         type: String,
    //     },
    //     customerID: {
    //         type: String,
    //     },
    // response_timestamp: {type: String},
    createdAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Account', accountSchema);