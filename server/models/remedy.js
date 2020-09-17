const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var RemedySchema = new mongoose.Schema({
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
    }, value: {
        type: Number,
        require: true
    },
});

RemedySchema.methods.toJSON = function () {
    var remedy = this;
    var remedyObject = remedy.toObject();

    return _.pick(remedyObject, ['_id', 'code', 'name', 'dosage', 'description', 'value']);
};

var Remedy = mongoose.model('Remedy', RemedySchema);

module.exports = {Remedy};