'use strict';
// Cargamos variables de configuración del fichero .env
require('dotenv').config()
require('../models/Anuncio');

const mongoose = require('mongoose');
const db = require('./connectMongoose');
const Anuncio = mongoose.model('Anuncio');
const Usuario = require('../models/Usuario');




/* Uso async/await para hacer que las querys hacia la base de datos sean "síncronas" */
async function initUsuarios() {

    let del = await Usuario.deleteMany();

    if (del.ok === 1) {

        let creationDb = await Usuario.insertMany([
            {
                username: 'admin', 
                email: 'admin@example.com',
                password: await Usuario.hashPassword(process.env.PASSWORD_ADMIN) 
            },
            {
                username: 'pablesite',
                email: 'pablo.ruiz.molina@gmail.com',
                password: await Usuario.hashPassword(process.env.PASSWORD_PABLO)
            }
        ])
        console.log('The database has been initialized with two users');
        return creationDb;
    }
    throw new Error('Error initializing the db');

}

/* Uso async/await para hacer que las querys hacia la base de datos sean "síncronas" */
async function initAnuncios() {

    /* Elimino los elementos de la base de datos */
    let del = await Anuncio.deleteMany({});

    if (del.ok === 1) { 

        /* Introduzco datos a la base de datos*/
        let json = require('../lib/anuncios.json');
        let creationDb = await Anuncio.insertMany(json.anuncios);
        console.log('The database has been initialized with the file anuncios.json');

        /* Desconecto la base de datos */
        mongoose.disconnect(process.env.MONGODB_URL, { useNewUrlParser: true });
        return creationDb;

    }
    throw new Error('Error initializing the db');
}


/* Manejo eventos de la base de datos */
db.on('error', function (err) {
    console.log(err);
});

db.once('open', async function () {
    try {
        await initUsuarios();
        await initAnuncios();

    } catch (err) {
        console.log('There was an error', err);
        process.exit(1);
    }

});













