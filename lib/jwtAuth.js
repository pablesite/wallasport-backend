'use strict';
 
const jwt = require('jsonwebtoken');

module.exports = function () {

    return function (req, res, next) {
        // leer el token que me mandan
        const token = req.body.token || req.query.token || req.get('Authorization');

        // si no tengo token no dejo pasar
        if (!token) {
            const err = new Error(res.__('No token provided. Please go to /apiv1/login in order to obtain a new token')); //esto se puede internacionalizar, en cualquier sitio de hecho
            err.status = 401;
            next(err);
            return;
        }

        // si el token es invalido no dejo pasar
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                const err = new Error(res.__('Invalid signature. Please go to /apiv1/login in order to obtain a new token'));
                err.status = 401;
                next(err);
                return;
            }

            req.apiUserId = payload._id; // aquí se podrían meter más cosas si fuera necesario, y no sólo el id.
            next();

        });



    }

}