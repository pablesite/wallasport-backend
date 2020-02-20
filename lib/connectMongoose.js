'use strict';

/* Cargar librerías */
const mongoose = require('mongoose');
const db = mongoose.connection;

/* Gestionar eventos de conexión */
db.on('error', function (err) {
    console.log(err);
    process.exit(1);
});

db.once('open', function () {
    console.info('Connected to mongodb.');
});


/* Lanzar la conexión */
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

/* Use Index */
mongoose.set('useCreateIndex', true);

// Exportar la conexión
module.exports = db;

