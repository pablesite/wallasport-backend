'use strict';

const mongoose = require('mongoose');
const bcrypy = require('bcrypt');


const usuarioSchema = mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
}, 
{ 
    collection: 'usuarios' //me salto la pluralización
}

);

usuarioSchema.statics.hashPassword = function(plainPassword) {
    return bcrypy.hash(plainPassword, 10);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;