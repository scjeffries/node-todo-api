const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
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
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    const access = 'auth';
    const token = jwt.sign({ _id: user._id.toString(), access }, 'abc123').toString();

    user.tokens.push({ access, token });

    // in order to allow server.js to chain onto the promise, we return it and also return the token value so the
    // then clause will look like .then((token) => ...
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };