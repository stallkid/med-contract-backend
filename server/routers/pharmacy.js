const express = require('express')
const { Pharmacy } = require('./../models/pharmacy')
const router = new express.Router()

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

router.get('/pharmacies/cnpj/:cnpj', async (req, res) => {
    const cnpj = req.params.cnpj

    try {
        const pharmacy = await Pharmacy.findOne({cnpj: cnpj})

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
    try {
        const cnpj = req.body.cnpj;
        const username = req.body.username;
        const password = req.body.password;

        const pharmacy = await Pharmacy.findOne({
            "cnpj": cnpj,
            "users.email": username,
            "users.password": password
        });
        if (pharmacy) {
            const user = pharmacy.users.filter( user => {
                return user.email === username;
            });
            res.status(200).send({
                "data": {
                    "id": user[0]._id,
                    "username": user[0].email,
                    "pharmacyId": pharmacy._id,
                    "role": user[0].role
                },
                "userStatus": true
            })
        } else {
            res.status(404).send(false)
        }
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router