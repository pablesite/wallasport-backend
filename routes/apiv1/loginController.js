'use strict';
const Usuario = require('../../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Creamos un Controller que nos servirá para asociar rutas en app.js
class LoginController {

    /**
     * GET /login 
     */
    index(req, res, next) {
        res.locals.email = '';
        res.locals.error = '';
        res.render('loginAPI');
    }

    // si existe el usuario le creo un JWT, 
    async loginJWT(req, res, next) {
        try {
            // recoger credenciales de la petición
            const email = req.body.email;
            const password = req.body.password;
            
            // buscar el usuario en BD
            const usuario = await Usuario.findOne({ email: email });

            // si no lo encontramos le decimos que no
            if (!usuario || !await bcrypt.compare(password, usuario.password)) {
                res.json({ success: false, error: res.__('Invalid credentials.') });
                return;
            }

            // creamos un JWT (Sería mejor hacerlo asíncrono)
            // no meter una instancia de mongoose en el Payload (sólo el id)
            const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET, {
                expiresIn: '2d'
            });
            // respondemos
            res.json({ success: true, token: token, info: res.__('Now you can go to the index and access with this token. You can also use the token to make requests from Postman.')});
            

        } catch (err) {
            next(err);
        }

    }

}

module.exports = new LoginController();