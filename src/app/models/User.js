const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
    username: {type: String, required: true, minLength: 1},
    email: {type: String, required: true, minLength: 6, unique: true},
    password: {type: String, required: true, minLength: 6},
}, {timestamps: true});

module.exports = mongoose.model('User', User)
