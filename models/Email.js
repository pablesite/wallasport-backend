'use strict';

const mongoose = require('mongoose');
const nodemailerTransport = require('../lib/nodemailerConfigure');

const emailSchema = mongoose.Schema({
    email: { type: String, unique: true },
});


emailSchema.methods.sendEmail = function (from, subject, body) {

    // enviar el correo
    return nodemailerTransport.sendMail({
        from: from,
        to: this.email,
        subject: subject,
        html: body,
    });
}

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;