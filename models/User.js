'use strict';

const mongoose = require('mongoose');
const bcrypy = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    photo: String,
    favs: [{ type: Schema.Types.ObjectId, ref: 'Advert' }]
},

);

userSchema.statics.hashPassword = function (password) {
    return bcrypy.hash(password, 10);
}

const User = mongoose.model('User', userSchema);

module.exports = User;