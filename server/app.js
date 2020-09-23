require('./config/config');
require('./database/mongoose');

const _ = require('lodash');
const express = require('express');
const moment = require('moment');

const patientRouter = require('./routers/patient')
const mailerRouter = require('./routers/mailer')
const medicRouter = require('./routers/medic')
const pharmacyRouter = require('./routers/pharmacy')
const paypalRouter = require('./routers/paypal')
const orderRouter = require('./routers/order')
const RemedyRouter = require('./routers/remedy');

const app = express();
const port = process.env.PORT || 3000;
moment.locale('pt-BR');

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(patientRouter);
app.use(mailerRouter);
app.use(medicRouter);
app.use(pharmacyRouter);
app.use(paypalRouter);
app.use(orderRouter);
app.use(RemedyRouter);

app.listen(port, () => {
    console.log(`Server Up and Running at port ${port}`);
});

module.exports = {app};