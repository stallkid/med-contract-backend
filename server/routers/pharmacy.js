const express = require('express')
const { Pharmacy } = require('./../models/pharmacy')
const router = new express.Router()
const bcrypt = require('bcryptjs');
const _ = require('lodash');

router.post('/pharmacies', async (req, res) => {
    const pharmacy = new Pharmacy(req.body)
    pharmacy.role = "pharmacy";

    try {
        await pharmacy.save()
        res.status(201).send(pharmacy)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/pharmacies', async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find({})
        res.send(pharmacies)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/pharmacies/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const pharmacy = await Pharmacy.findById(_id)

        if (!pharmacy) {
            return res.status(404).send()
        }

        res.send(pharmacy)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/pharmacies/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password', 'addresses']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!pharmacy) {
            return res.status(404).send()
        }

        res.send(pharmacy)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/pharmacies/:id', async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id)

        if (!pharmacy) {
            return res.status(404).send()
        }

        res.send(pharmacy)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/pharmacies/me',(req, res) => {
    res.send(req.pharmacy);
});

router.post('/pharmacies/login', async (req, res) => {
    const crm = req.body.crm;
    const password = req.body.password;

    try {
        const pharmacy = await Pharmacy.find({crm: crm, password: password});
        if (pharmacy.length > 0) {
            res.status(200).send(true)
        } else {
            res.status(404).send(false)
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router