'use strict';

const jwt = require('jsonwebtoken');

module.exports = function () {

    return function (req, res, next) {

        if (req.method === 'OPTIONS') {
            next();
        } else {

            const token = req.body.token || req.query.token || req.get('Authorization');

            // It is checked if the request has a token.
            if (!token) {
                const err = new Error(res.__('No token provided')); 
                err.status = 401;
                next(err);
                return;
            }

            // It is checked if the token is valid.
            jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                if (err) {
                    const err = new Error(res.__('Invalid signature'));
                    err.status = 401;
                    next(err);
                    return;
                }

                // The payload only contains the user id.
                req.apiUserId = payload._id;
                next();
                
            });
        }
    }
}