const mongoose = require('mongoose');
const tokenSchema = mongoose.Schema({
    "token": {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
module.exports = mongoose.model('tokenSchema', tokenSchema);