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
    try {
        const _id = req.params.id
        const order = await Order.findById(_id)

        if (!order) {
            return res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/orders/checkOrder/:hashId', async (req, res) => {
    try {
        const hashId = req.params.hashId
        const order = await Order.findOne({hashId: hashId})

        if (!order) {
            return res.send(false)
        }

        res.send(true)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/orders/pharmacy/:pharId', async (req, res) => {
    try {
        const pharId = req.params.pharId;
        console.log(pharId);
        const order = await Order.find({pharmacyId: pharId})
        console.log(order);
        if (!order) {
            return res.status(200).send({
                message: "Sem pedidos para esta loja"
            })
        }

        res.send(order)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/orders/checkout/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId

        const order = await Order.findByIdAndUpdate(orderId, req.body, { new: true, runValidators: true })

        if (!order) {
            return res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router