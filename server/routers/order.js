const express = require('express')
const { Order } = require('./../models/order')
const router = new express.Router()

router.post('/orders', async (req, res) => {
    const order = new Order(req.body)
    order.role = "order";

    try {
        await order.save()
        res.status(201).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({})
        res.send(orders)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/orders/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const order = await Order.findById(_id)

        if (!order) {
            return res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router