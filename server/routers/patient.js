const express = require('express')
const { Patient } = require('./../models/patient')
const router = new express.Router()
const _ = require('lodash');

router.post('/patients', async (req, res) => {
    const patient = new Patient(req.body)
    patient.role = "patient";

    try {
        await patient.save()
        res.status(201).send(patient)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find({})
        res.send(patients)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/patients/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const patient = await Patient.findById(_id)

        if (!patient) {
            return res.status(404).send()
        }

        res.send(patient)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/patients/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password', 'addresses']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!patient) {
            return res.status(404).send()
        }

        res.send(patient)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id)

        if (!patient) {
            return res.status(404).send()
        }

        res.send(patient)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/patients', async (req, res) => {
    const patient = new Patient(req.body)
    patient.role = "patient";

    try {
        await patient.save()
        res.status(201).send(patient)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router