'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Anuncio = mongoose.model('Anuncio');
const thumbnailClient = require('../../lib/microservices/thumbnailClient')
const path = require('path');

/* Recupero los parámetros que me entran en la ruta */
router.get('/', function (req, res, next) { // si lo protejo fuera, no hay que ponerlo otra vez aquí (jwtAuth)

    let filter = {};

    if (req.query.nombre) {
        filter.nombre = req.query.nombre;
    }

    if (req.query.venta) {
        filter.venta = req.query.venta;
    }

    if (req.query.precio) {
        filter.precio = req.query.precio;
    }

    if (req.query.tag) {
        filter.tag = req.query.tag;
    }

    let limit = parseInt(req.query.limit) || null;
    let skip = parseInt(req.query.skip) || null;
    let fields = req.query.fields || null;
    let sort = req.query.sort || '_id'; //lo del id?

    /* Hago la consulta según los parámetros que me han entrado */
    Anuncio.list(filter, limit, skip, fields, sort, function (err, list) {
        if (err) {
            next(err);
            return;
        }

        /* Devuelvo un json */
        res.json({ ok: true, list: list });

    });
});

/* Recupero los parámetros que me entran en la ruta */
router.get('/:id', function (req, res, next) { // si lo protejo fuera, no hay que ponerlo otra vez aquí (jwtAuth)
    
    let id = req.params.id;

    Anuncio.find({ _id: id }, function (err, list) {
        if (err) {
            next(err);
            return;
        }

        /* Devuelvo un json */
        res.json({ ok: true, advert: list[0] });
    })
});

/* Crear un anuncio */
router.post('/', function (req, res, next) {
    console.log('hago POST')
    let anuncio = new Anuncio(req.body);
    // lanzo el cliente para generar el thumbnail
    thumbnailClient.cliente(path.join('img/', req.body.foto));
    
    anuncio.save(function (err, anuncioGuardado) {
        if (err) {
            return next(err);
        }
        res.json({ ok: true, anuncio: anuncioGuardado });
    });
});

/* Actualizar un anuncio */
router.put('/:id', function (req, res, next) {
    let id = req.params.id;
    Anuncio.update({ _id: id }, req.body, function (err, anuncio) {
        if (err) {
            return next(err);
        }
        res.json({ ok: true, anuncio: anuncio });
    });
});

/* Borrar un anuncio */
router.delete('/:id', function (req, res, next) {
    let id = req.params.id;
    Anuncio.remove({ _id: id }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.json({ ok: true, result: result });
    });
});

module.exports = router;