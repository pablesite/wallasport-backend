'use strict';
// Cargamos variables de configuración del fichero .env
require('dotenv').config()
require('../models/Advert');

const mongoose = require('mongoose');
const db = require('./connectMongoose');
const Advert = mongoose.model('Advert');
const User = require('../models/User');




/* Uso async/await para hacer que las querys hacia la base de datos sean "síncronas" */
async function initUsers() {

    let del = await User.deleteMany();

    if (del.ok === 1) {

        let creationDb = await User.insertMany([
            {
                username: 'admin', 
                email: 'admin@example.com',
                password: await User.hashPassword(process.env.PASSWORD_ADMIN),
                favs: [],
            },
            {
                username: 'pablesite',
                email: 'pablo.ruiz.molina@gmail.com',
                password: await User.hashPassword(process.env.PASSWORD_PABLO),
                favs: [],
            },

            {
                username: 'ana',
                email: 'ana@gmail.com',
                password: await User.hashPassword(process.env.PASSWORD_PABLO),
                favs: [],
            }
        ])
        console.log('The database has been initialized with two users');
        return creationDb;
    }
    throw new Error('Error initializing the db');

}

/* Uso async/await para hacer que las querys hacia la base de datos sean "síncronas" */
async function initAdverts() {

    /* Elimino los elementos de la base de datos */
    let del = await Advert.deleteMany({});

    if (del.ok === 1) { 

        /* Introduzco datos a la base de datos*/
        let json = require('../lib/adverts.json');
        let creationDb = await Advert.insertMany(json.adverts);
        console.log('The database has been initialized with the file adverts.json');

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
        await initUsers();
        await initAdverts();

    } catch (err) {
        console.log('There was an error', err);
        process.exit(1);
    }

});













