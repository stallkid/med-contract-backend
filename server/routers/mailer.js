const express = require('express')
const router = new express.Router()
const nodeMailer = require('nodemailer');
const moment = require('moment');
const _ = require('lodash');

router.post('/sendEmail', (req, res) => {
    const currentDate = moment().format('DD / MM / YYYY');
    const body = _.pick(req.body, ['hashId', 'randomPass']);

    let transporter = nodeMailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'myron.schuppe43@ethereal.email', // generated ethereal user
          pass: 'rYAr7fV1jsH5vB4Xf1', // generated ethereal password
        },
      });
        transporter.sendMail({
            from: '"Med-Contract" <med-contract@tcc.com>', // sender address
            to: "paciente@email.com", // list of receivers
            subject: `Receita Médica - ${currentDate}`, // Subject line
            text: `Este é o código para retirar a receita ${body.hashId}`, // plain text body
            html: `Este é o código para retirar a receita <b>${body.hashId}</b><br>Esta é a senha para retirar a receita <b>${body.randomPass}</b>`, // html body
        }, (error, info) => {
            if (error) {
                res.json(error);
            }
            res.json(info);
        });
});

module.exports = router