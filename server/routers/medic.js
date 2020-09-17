const express = require('express')
const { Medic } = require('./../models/medic')
const router = new express.Router()
const bcrypt = require('bcryptjs');
const _ = require('lodash');

router.post('/medics', async (req, res) => {
    const medic = new Medic(req.body)
    medic.role = "medic";

    try {
        await medic.save()
        res.status(201).send(medic)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/medics/login', async (req, res) => {
    try {
        const crm = req.body.crm;
        const password = req.body.password;

        const medic = await Medic.findOne({crm: crm, password: password});
        if (medic) {
            res.send({
                "data": {
                    "id": medic._id,
                    "role": "medic",
                    "crm": medic.crm
                },
                "userStatus": true 
            });
        } else {
            res.status(404).send({
                "error": "Wrong credentials",
                "userStatus": false
            })
        }
        
    } catch (e) {
        
    }
})

router.get('/medics', async (req, res) => {
    try {
        const medics = await Medic.find({})
        res.send(medics)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/medics/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const medic = await Medic.findById(_id)

        if (!medic) {
            return res.status(404).send()
        }

        res.send(medic)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/medics/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password', 'addresses']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const medic = await Medic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!medic) {
            return res.status(404).send()
        }

        res.send(medic)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/medics/:id', async (req, res) => {
    try {
        const medic = await Medic.findByIdAndDelete(req.params.id)

        if (!medic) {
            return res.status(404).send()
        }

        res.send(medic)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/medics/me',(req, res) => {
    res.send(req.medic);
});

router.post('/medics/login', async (req, res) => {
    const crm = req.body.crm;
    const password = req.body.password;

    try {
        const medic = await Medic.find({crm: crm, password: password});
        if (medic.length > 0) {
            res.status(200).send(true)
        } else {
            res.status(404).send(false)
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router