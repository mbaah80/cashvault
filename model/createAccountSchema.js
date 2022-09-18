const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
      accountDetails:{
          type: Object
      },
        response_message: {
            type: String,
        },
      sourceCode: {
                type: String,
            },
     responseCode: {
                type: String,
            },
            responseMessage: {
                type: String,
            },
        shortname: {
            type: String,
        },
        accountNo: {
            type: String,
        },
        customerID: {
            type: String,
        },
    response_timestamp: {type: String},
    requestId: {
        type: String,
    },
    affiliateCode: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastname: {
        type: String,
    },
    mobileNo: {
        type: String,
    },
    gender: {
        type: String,
    },
    identityNo: {
        type: String,
    },
    identityType: {
        type: String,
    },
    IDIssueDate: {
        type: String,
    },
    IDExpiryDate: {
        type: String,
    },
    ccy: {
        type: String,
    },
    country: {
        type: String,
    },
    branchCode: {
        type: String,
    },
    datetime: {
        type: String,
    },
    countryOfResidence: {
        type: String,
    },
    email: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    street: {
        type: String,
    },
    secureHash: {
        type: String,
    },
    createdAt: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Account', accountSchema);