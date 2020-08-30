const express = require('express')
const { Medic } = require('./../models/medic')
const router = new express.Router()
const _ = require('lodash');

router.post('/medics', (req, res) => {
    var body= _.pick(req.body, [ 'crm', 'password', 'status', 'personal']);
    var medic = new Medic(body);

    medic.save().then(() => {
        return medic.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(medic);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

router.get('/medics/me',(req, res) => {
    res.send(req.medic);
});

module.exports = router