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

        if (req.query.tag) {
            filter.tag = req.query.tag;
        }

        if (req.query.userOwner) {
            filter.userOwner = req.query.userOwner;
        }

        let limit = parseInt(req.query.limit) || null;
        let skip = parseInt(req.query.skip) || null;
        let fields = req.query.fields || null;
        let sort = req.query.sort || { creationDate: -1 }; //lo del id? // Esto habrá que modificarlo para que me devuelva los más antiguos o los más recientes.


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


    //funciona guay, pero tendría que ver cómo repartirlo después a cada anuncio

    async goToAdvertDetail(req, res, next) {
        try {
            let slugName = req.params.slugName;

            let advert = await Advert.findOne({ slugName: slugName })
                .populate({ path: 'userOwner' })
            /* Devuelvo un json */
            res.json({ ok: true, advert: advert });

        } catch (err) {
            next(err);
        }

    };


    /* An advert is created */
    post(req, res, next) {


        let advert = new Advert(req.body);

        advert.creationDate = Date.now();
        // lanzo el cliente para generar el thumbnail
        // thumbnailClient.cliente(path.join('img/', req.body.foto)); //no funciona y no sé por qué

        const separator = ",";
        advert.tags = advert.tags[0].split(separator);

        advert.save(function (err, saveAdvert) {
            if (err) {
                return next(err);
            }
            res.json({ ok: true, advert: saveAdvert });
        });
    };

    /* Actualizar un advert */
    put(req, res, next) {
        let slugName = req.params.slugName;
        
        let tags = [];
        const separator = ",";
        tags = req.body.tags.split(separator)

        const updateAdvert = {
            name: req.body.name,
            slugName: req.body.slugName,
            description: req.body.description,
            photo: req.body.photo,
            type: req.body.type,
            price: req.body.price,
            tags: tags,
            reserved: req.body.reserved,
            sold: req.body.sold,
        }
     

        Advert.update({ slugName: slugName }, updateAdvert, function (err, info) {
            if (err) {
                return next(err);
            }
            res.json({ ok: true, info: info });
        });
    };

    /* Borrar un advert */
    delete(req, res, next) {
        let slugName = req.params.slugName;
        Advert.remove({ slugName: slugName }, function (err, info) {
            if (err) {
                return next(err);
            }
            res.json({ ok: true, info: info });
        });
    };

}

module.exports = new AdvertsController();