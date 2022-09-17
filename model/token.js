let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let tokenSchema = new Schema({
    token: {
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})
module.exports = mongoose.model('tokenSchema', tokenSchema);