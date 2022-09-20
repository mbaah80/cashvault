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
    created_at: {
        type: Date,
    }
})
module.exports = mongoose.model('User', userSchema);