'use strict';

const nodemailer = require('nodemailer');

// crear un transport
const transport = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: process.env.SENDGRID_USER, 
        pass: process.env.SENDGRID_PASS 
    }
});

module.exports = transport;