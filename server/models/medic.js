const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var MedicSchema = new mongoose.Schema({
    crm: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    hashId: {
        type: String,
        require: true,
    },
    status: {
        type: Boolean,
        require: true
    },
    role: {
        type: String,
        require: false,
        enum: ['medic', 'pharmacy', 'admin', 'patient']
    },
    personal: {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        subscription: {
            type: String,
            required: true,
            trim: true,
            enum: ['principal']
        },
        spec: {
            type: String,
            required: true,
            trim: true
        },
        workArea: {
            type: String,
            required: true,
            trim: true
        },
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
    }]
});

MedicSchema.methods.toJSON = function () {
    var medic = this;
    var medicObject = medic.toObject();

    return _.pick(medicObject, ['_id', 'crm', 'hashId', 'status', 'personal']);
};

MedicSchema.methods.generateAuthToken = function () {
    var medic = this;
    var access = 'auth';
    var token = jwt.sign({_id: medic._id.toHexString(), access}, 'abc123').toString();

    // medic.tokens.push({access, token})
    medic.tokens = medic.tokens.concat([{access, token}]);

    medic.save().then(() => {
        return token;
    });
};

MedicSchema.statics.findByToken = function(token) {
    var Medic = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return Medic.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// MedicSchema.pre('save', function (next) {
//     var medic = this;

    // if (medic.isModified('password')) {
    //     bcrypt.genSalt(10, (err, salt) => {
    //         bcrypt.hash(medic.password, salt, (err, hash) => {
    //             medic.password = hash
    //             next();
    //         });
    //     });
    // } else {
    //     return next();
    // }
// });

var Medic = mongoose.model('Medic', MedicSchema);

module.exports = {Medic};