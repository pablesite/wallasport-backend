'use strict';

const express = require('express');
const router = express.Router();
const User = require('../../models/User');


router.get('/:username', async function (req, res, next) {
    try {

        const username = req.params.username;

        let user = await User.findOne({ username: username });

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

        // The password is hashed
        req.body.password = await User.hashPassword(req.body.password)

        User.updateOne({ username: username }, req.body, function (err, info) {
            if (err) {
                return next(err);
            }
            res.json({ ok: true, info: info });
        });

    } catch (err) {
        next(err);
    }

});


module.exports = router;