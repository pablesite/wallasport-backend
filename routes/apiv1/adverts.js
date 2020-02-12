'use strict';

const mongoose = require('mongoose');
const Advert = mongoose.model('Advert');
// const thumbnailClient = require('../../lib/microservices/thumbnailClient')
// const path = require('path');


class AdvertsController {

    /* Recupero los parámetros que me entran en la ruta */
    get(req, res, next) {

        let filter = {};

        if (req.query.name) {
            filter.name = req.query.name;
        }

        if (req.query.price) {
            filter.price = req.query.price;
        }

        // if (req.query.type) {
        //     filter.type = req.query.type;
        // }

        if (req.query.tags) {
            filter.tags = req.query.tags;
        }

        let limit = parseInt(req.query.limit) || null;
        let skip = parseInt(req.query.skip) || null;
        let fields = req.query.fields || null;
        let sort = req.query.sort || {creationDate: -1}; //lo del id? // Esto habrá que modificarlo para que me devuelva los más antiguos o los más recientes.


        /* Hago la consulta según los parámetros que me han entrado */
        Advert.list(filter, limit, skip, fields, sort, function (err, list) {
            if (err) {
                next(err);
                return;
            }

            /* Devuelvo un json */
            res.json({ ok: true, list: list });

        });
    };



    /* Recupero los parámetros que me entran en la ruta */
    getOneAdvert(req, res, next) { // si lo protejo fuera, no hay que ponerlo otra vez aquí (jwtAuth)

        let id = req.params.id;

        Advert.find({ _id: id }, function (err, list) {
            if (err) {
                next(err);
                return;
            }

            /* Devuelvo un json */
            res.json({ ok: true, advert: list[0] });
        })
    };

    /* An advert is created */
    post(req, res, next) {

        let advert = new Advert(req.body);
        advert.creationDate=Date.now();
        // lanzo el cliente para generar el thumbnail
        // thumbnailClient.cliente(path.join('img/', req.body.foto)); //no funciona y no sé por qué
    
        advert.save(function (err, saveAdvert) {
            if (err) {
                return next(err);
            }
            res.json({ ok: true, advert: saveAdvert });
        });
    };

    /* Actualizar un advert */
    put(req, res, next) {
        let id = req.params.id;
        Advert.update({ _id: id }, req.body, function (err, advert) {
            if (err) {
                return next(err);
            }
            res.json({ ok: true, advert: advert });
        });
    };

    /* Borrar un advert */
    delete(req, res, next) {
        let id = req.params.id;
        Advert.remove({ _id: id }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json({ ok: true, result: result });
        });
    };

}

module.exports = new AdvertsController();