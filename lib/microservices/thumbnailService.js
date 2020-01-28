'use Strict';

// Servicio de cambio de moneda

const cote = require('cote');
const Jimp = require('jimp');
const path = require('path');


// declarar el microservicio 
const responder = new cote.Responder({ name: 'thumbnail' });

// lógica del microservicio
responder.on('foto', (req, done) => {
    console.log('servicio: Creando el thumbnail de:', req.url_foto, Date.now());

    url_get = path.join('../../public/', req.url_foto);
    r = path.parse(req.url_foto);
    url_set = path.join('../../public/', r.dir, r.name + '-thumb' + r.ext);

    Jimp.read(url_get)
        .then(thumbnail => {
            return thumbnail
                .resize(100, 100, Jimp.RESIZE_BEZIER)   // resize
                .quality(100)                           // set JPEG quality
                .write(url_set);                        // save
        })
        .catch(err => {
            console.error(err);
        });

    done(path.join( r.dir, r.name + '-thumb' + r.ext));
});