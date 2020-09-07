const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var PatientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    role: {
        type: String,
        require: true,
        enum: ['medic', 'pharmacy', 'admin', 'patient']
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }],
    personal: {
        name: {
            type: String,
            require: false,
        },
        document: [{
            type: {
                type: String,
                require: false,
                enum: ['RG', 'CPF']
            },
            value: {
                type: String,
                require: false,
            }
        }],
        addresses: [{
            country: {
                type: String,
                require: false
            },
            state: {
                type: String,
                require: false
            },
            city: {
                type: String,
                require: false
            },
            neighborhood: {
                type: String,
                require: false
            },
            address: {
                type: String,
                require: false
            },
            number: {
                type: Number,
                require: false
            },
            cep: {
                type: String,
                require: false
            }
        }],
    }
});

PatientSchema.methods.toJSON = function () {
    var patient = this;
    var patientObject = patient.toObject();

    return _.pick(patientObject, ['_id', 'email', 'personal']);
};

PatientSchema.methods.generateAuthToken = function () {
    var patient = this;
    var access = 'auth';
    var token = jwt.sign({_id: patient._id.toHexString(), access}, 'abc123').toString();

    patient.tokens = patient.tokens.concat([{access, token}]);

    patient.save().then(() => {
        return token;
    });
};

PatientSchema.statics.findByToken = function(token) {
    var Patient = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return Patient.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

PatientSchema.pre('save', function (next) {
    var patient = this;

    if (patient.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(patient.password, salt, (err, hash) => {
                patient.password = hash
                next();
            });
        });
    } else {
        return next();
    }
});

var Patient = mongoose.model('Patient', PatientSchema);

module.exports = {Patient};