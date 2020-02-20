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
            _id: user._id,
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

router.get('/:username/:populate/:sort', async function (req, res, next) {
    try {

        const { username, populate, sort } = req.params;

        let user = await User.findOne({ username: username })
            .populate({
                path: populate,
                populate: {
                    path: 'userOwner'
                },
                options: {
                    sort: sort
                }
            })


        if (req.apiUserId != user._id) {
            res.json({ success: false, error: 'You do not permission for this info.' });
            return;
        }

        // Password is not returned!
        user = {
            _id: user._id,
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
                let i = user.favs.indexOf(req.body.favs);
                i !== -1 && user.favs.splice(i, 1);
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