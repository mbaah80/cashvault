let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    verified: {
      type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
    }
})
module.exports = mongoose.model('User', userSchema);