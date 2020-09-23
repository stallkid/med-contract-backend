const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var PharmacySchema = new mongoose.Schema({
    cnpj: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
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
        },
        geolocation: {
            latitude: {
                type: Number,
                require: false
            },
            longitude: {
                type: Number,
                require: false
            }
        }
    }],
    users: [{
        email: {
            type: String,
            required: false,
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
            require: false,
            minlength: 6,
        },
        role: {
            type: String,
            require: false,
            enum: ['medic', 'pharmacy', 'admin', 'patient']
        },
        tokens: [{
            access: {
                type: String,
                require: false
            },
            token: {
                type: String,
                require: false
            }
        }],
    }]
});

PharmacySchema.methods.toJSON = function () {
    var pharmacy = this;
    var pharmacyObject = pharmacy.toObject();

    return _.pick(pharmacyObject, ['_id', 'cnpj', 'name', 'addresses', 'users']);
};

PharmacySchema.methods.generateAuthToken = function () {
    var pharmacy = this;
    var access = 'auth';
    var token = jwt.sign({_id: pharmacy._id.toHexString(), access}, 'abc123').toString();

    // pharmacy.tokens.push({access, token})
    pharmacy.tokens = pharmacy.tokens.concat([{access, token}]);

    pharmacy.save().then(() => {
        return token;
    });
};

PharmacySchema.statics.findByToken = function(token) {
    var Pharmacy = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return Pharmacy.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// PharmacySchema.pre('save', function (next) {
//     var pharmacy = this;

    // if (pharmacy.isModified('password')) {
    //     bcrypt.genSalt(10, (err, salt) => {
    //         bcrypt.hash(pharmacy.password, salt, (err, hash) => {
    //             pharmacy.password = hash
    //             next();
    //         });
    //     });
    // } else {
    //     return next();
    // }
// });

var Pharmacy = mongoose.model('Pharmacy', PharmacySchema);

module.exports = {Pharmacy};