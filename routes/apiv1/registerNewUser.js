'use strict';

const express = require('express');
const router = express.Router();

const User = require('../../models/User');


router.post('/', async function (req, res, next) {

    try {

        // Request credentials are collected
        let user = new User(req.body);

        // The username and email is searched in the database
        const username_db = await User.find({ username: user.username });
        const email_db = await User.findOne({ email: user.email });

        // Check if username or email is already in database.
        if ((username_db == user.username) || (email_db == user.email)) {
            res.json({ success: false, error: 'This username or email is already register' });
            return;
        }

        // The password is hashed
        user.password = await User.hashPassword(user.password)

        // The user is saved in database
        user.save(function (err, userSaved) {
            if (err) {
                return next(err);
            }
            res.json({ success: true, user: userSaved });
        });

    } catch (err) {
        next(err);
    }

});

module.exports = router;