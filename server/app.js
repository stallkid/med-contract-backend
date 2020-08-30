require('./config/config');
require('./database/mongoose');

const _ = require('lodash');
const express = require('express');
const moment = require('moment');

const userRouter = require('./routers/user')
const mailerRouter = require('./routers/mailer')
const medicRouter = require('./routers/medic')

const app = express();
const port = process.env.PORT || 3000;
moment.locale('pt-BR');

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(userRouter);
app.use(mailerRouter);
app.use(medicRouter);

app.listen(port, () => {
    console.log(`Server Up and Running at port ${port}`);
});

module.exports = {app};