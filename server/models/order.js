const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var OrderSchema = new mongoose.Schema({
    hashId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    patientId: {
        type: String,
        required: true,
    },
    medicineId: {
        type: String,
        required: true
    },
    pharmacyId: {
        type: String,
        required: true
    },
    orderDetails: {
        selectedStore: {
            type: String,
            required: false
        },
        value: {
            type: Number,
            required: false
        },
        quantity: {
            type: Number,
            required: false
        },
        status: {
            type: Boolean,
            required: true
        }
    }
});

OrderSchema.methods.toJSON = function () {
    var order = this;
    var orderObject = order.toObject();

    return _.pick(orderObject, ['_id', 'hashId', 'patientId', 'medicineId', 'pharmacyId', 'orderDetails']);
};

var Order = mongoose.model('Order', OrderSchema);

module.exports = {Order};