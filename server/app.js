require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 3000;
moment.locale('pt-BR');

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/sendEmail', (req, res) => {
    const currentDate = moment().format('DD / MM / YYYY');
    const body = _.pick(req.body, ['hashId']);

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
            html: `Este é o código para retirar a receita <b>${body.hashId}</b>`, // html body
        }, (error, info) => {
            if (error) {
                res.json(error);
            }
            res.json(info);
        });
});

app.listen(port, () => {
    console.log(`Server Up and Running at port ${port}`);
});

module.exports = {app};