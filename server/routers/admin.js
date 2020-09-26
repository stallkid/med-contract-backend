const express = require('express')
const { Admin } = require('./../models/admin')
const router = new express.Router()

router.post('/admins', async (req, res) => {
    const admin = new Admin(req.body)
    admin.role = "admin";

    try {
        await admin.save()
        res.status(201).send(admin)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/admins/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const admin = await Admin.findOne({email: email, password: password});
        if (admin) {
            res.send({
                "data": {
                    "id": admin._id,
                    "role": "admin",
                    "email": admin.email
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

router.get('/admins', async (req, res) => {
    try {
        const admins = await Admin.find({})
        res.send(admins)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/admins/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const admin = await Admin.findById(_id)

        if (!admin) {
            return res.status(404).send()
        }

        res.send(admin)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/admins/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['email', 'password', 'addresses']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!admin) {
            return res.status(404).send()
        }

        res.send(admin)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/admins/:id', async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id)

        if (!admin) {
            return res.status(404).send()
        }

        res.send(admin)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/admins/me',(req, res) => {
    res.send(req.admin);
});

router.post('/admins/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const admin = await Admin.find({email: email, password: password});
        if (admin.length > 0) {
            res.status(200).send(true)
        } else {
            res.status(404).send(false)
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router