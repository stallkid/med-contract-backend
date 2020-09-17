const express = require('express')
const { Remedy } = require('./../models/remedy')
const router = new express.Router()

router.post('/remedies', async (req, res) => {
    const remedy = new Remedy(req.body)
    remedy.role = "remedy";

    try {
        await remedy.save()
        res.status(201).send(remedy)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/remedies', async (req, res) => {
    try {
        const remedies = await Remedy.find({})
        res.send(remedies)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/remedies/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const remedy = await Remedy.findById(_id)

        if (!remedy) {
            return res.status(404).send()
        }

        res.send(remedy)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/remedies/code/:code', async (req, res) => {
    try {
        const code = req.params.code

        const remedy = await Remedy.findOne({code: code})
        if (!remedy) {
            return res.status(404).send()
        }
        res.send(remedy)
    } catch (e) {
        res.status(500).send(e);
    }
})

router.patch('/remedies/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password', 'address']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const remedy = await Remedy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!remedy) {
            return res.status(404).send()
        }

        res.send(remedy)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/remedies/:id', async (req, res) => {
    try {
        const remedy = await Remedy.findByIdAndDelete(req.params.id)

        if (!remedy) {
            return res.status(404).send()
        }

        res.send(remedy)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router