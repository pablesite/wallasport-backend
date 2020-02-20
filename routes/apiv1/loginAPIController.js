'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

/* Login is verified */
router.post('/', async function (req, res, next) {
    try {
        // Request credentials are collected
        const username = req.body.username;
        const password = req.body.password;

        // The user is searched in the database
        const user = await User.findOne({ username: username });
        // If the user is not found, invalid credentials
        if (!user || !await bcrypt.compare(password, user.password)) {
            res.json({ success: false, error: 'Invalid token' });
            return;
        }

        // A JWT is created for the user.
        // Only the id is stored in the payload. No information is transmitted in the requests.
        const token = await jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '2d' }
        );

        // The token is sent to the user
        res.json({ success: true, token: token });

    } catch (err) {
        next(err);
    }

});

module.exports = router;