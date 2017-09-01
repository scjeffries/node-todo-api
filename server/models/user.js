const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    const token = jwt.sign({ _id: user._id.toString(), access }, process.env.JWT_SECRET).toString();

    user.tokens.push({ access, token });

    // in order to allow server.js to chain onto the promise, we return it and also return the token value so the
    // then clause will look like .then((token) => ...
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.statics.findByToken = function(token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject();  // shorthand to reject promise, can be passed an error value
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    const User = this;

    return User.findOne({ email }).then((user) => {
        if(!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(err || !res) {
                    reject();
                } else {
                    resolve(user);
                }
            });
        });
    });
};

UserSchema.pre('save', function(next) {
    const user = this;

    // check if password was modified
    // times when we save the document where the password isn't updated which means it is already hashed
    // this middleware will run on every save, so we don't want to accidentally hash the hash
    if(user.isModified('password')) {  // returns true if password is modified, so need to encrypt it
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };