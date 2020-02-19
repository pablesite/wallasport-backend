'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

/* Login is verified */
router.post('/', async function (req, res, next) {
        try {
            console.log('pasa1')
            // Request credentials are collected
            const username = req.body.username;
            const password = req.body.password;
            
            // The user is searched in the database
            const user = await User.findOne({ username: username });
            console.log('pasa2')
            // If the user is not found, invalid credentials
            if (!user || !await bcrypt.compare(password, user.password)) {
                res.json({ success: false, error: 'Invalid token' });
                return;
            }

            console.log('pasa3')
            // A JWT is created for the user.
            // Only the id is stored in the payload. No information is transmitted in the requests.
            const token = await jwt.sign(
                { _id: user._id }, 
                process.env.JWT_SECRET, 
                { expiresIn: '2d'}
                );

                console.log('pasa4')
            // The token is sent to the user
            res.json({ success: true, token: token });
            
        } catch (err) {
            next(err);
        }

});

module.exports = router;