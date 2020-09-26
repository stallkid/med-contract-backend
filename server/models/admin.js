const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var AdminSchema = new mongoose.Schema({
    email: {
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
    status: {
        type: Boolean,
        require: true
    },
    personal: {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        }
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
    }]
});

AdminSchema.methods.toJSON = function () {
    var admin = this;
    var adminObject = admin.toObject();

    return _.pick(adminObject, ['_id', 'email', 'status', 'personal']);
};

AdminSchema.methods.generateAuthToken = function () {
    var admin = this;
    var access = 'auth';
    var token = jwt.sign({_id: admin._id.toHexString(), access}, 'abc123').toString();

    // admin.tokens.push({access, token})
    admin.tokens = admin.tokens.concat([{access, token}]);

    admin.save().then(() => {
        return token;
    });
};

AdminSchema.statics.findByToken = function(token) {
    var Admin = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return Admin.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// AdminSchema.pre('save', function (next) {
//     var admin = this;

    // if (admin.isModified('password')) {
    //     bcrypt.genSalt(10, (err, salt) => {
    //         bcrypt.hash(admin.password, salt, (err, hash) => {
    //             admin.password = hash
    //             next();
    //         });
    //     });
    // } else {
    //     return next();
    // }
// });

var Admin = mongoose.model('Admin', AdminSchema);

module.exports = {Admin};