const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var MedicineSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
    },
    name: {
        type: String,
        require: true,
        minlength: 6,
    },
    dosage: {
        type: Number,
        require: true,
    },
    description: {
        type: String,
        require: true
    }
});

MedicineSchema.methods.toJSON = function () {
    var medicine = this;
    var medicineObject = medicine.toObject();

    return _.pick(medicineObject, ['_id', 'code', 'name', 'dosage', 'description']);
};

var Medicine = mongoose.model('Medicine', MedicineSchema);

module.exports = {Medicine};