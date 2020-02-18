'use strict';

const express = require('express');
const router = express.Router();
const User = require('../../models/User');


// const Advert = require('../../models/Advert');


router.get('/:username', async function (req, res, next) {
    try {
// CUIDADO, Según coja los usuarios, esto será un id de tipo string (normal) o un objeto con _id (populate).
        const username = req.params.username;
   

        let user = await User.findOne({ username: username });

        //el populate va así! Sirve para buscar los anuncios favoritos del usuario
        //let user = await User.findOne({ username: username }).populate('favs')

        if (req.apiUserId != user._id) {
            res.json({ success: false, error: 'You do not permission for this info.' });
            return;
        }

        // Password is not returned!
        user = {
            username: user.username,
            email: user.email,
            photo: user.photo,
            favs: user.favs,
        }

        res.json({ success: true, user: user });

    } catch (err) {
        next(err);
    }
});


router.put('/:username', async function (req, res, next) {
    try {

        const username = req.params.username;

        let user = await User.findOne({ username: username });

        user = {
            username: req.body.username || user.username,
            password: (req.body.password && await User.hashPassword(req.body.password)) || user.password,
            email: req.body.email || user.email,
            photo: req.body.photo || user.photo,
            favs: user.favs,
        }

        // favourites are introduced or removed from the list.
        if (req.body.favs) {        
            if (user.favs.find(e => e == req.body.favs)) {
                // pop elemento of the list
                let i = user.favs.indexOf( req.body.favs );
                i !== -1 && user.favs.splice( i, 1 );              
            } else {
                // push element in the list
                user.favs.push({ _id: req.body.favs })
            }

        }

        User.updateOne({ username: username }, user, function (err, info) {
            if (err) {
                return next(err);
            }
            res.json({ ok: true, info: info });
        });

    } catch (err) {
        next(err);
    }

});



router.delete('/:username', async function (req, res, next) {
    let username = req.params.username;
    User.remove({ username: username }, function (err, info) {
        if (err) {
            return next(err);
        }
        res.json({ ok: true, info: info });
    });
});




module.exports = router;