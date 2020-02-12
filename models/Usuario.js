'use strict';

const mongoose = require('mongoose');
const bcrypy = require('bcrypt');


const usuarioSchema = mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    favs: [String], //solución compañero: favs: [{type: Schema.Types.ObjectId, ref: 'Advert'}]
}, 
{ 
    collection: 'usuarios' //me salto la pluralización
}

);

usuarioSchema.statics.hashPassword = function(password) {
    return bcrypy.hash(password, 10);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;