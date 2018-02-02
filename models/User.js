const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const winston = require('winston');

/**
 * User table
 */
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlength: [3, 'Username should be at least 3 characters long'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z]+$/.test(v);
            },
            message: 'Username can contain only letters!'
        },
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password should be at least 6 characters long']
    }
});

/**
 * Create user
 *
 * @param username
 * @param password
 * @param callback
 * @returns {*}
 */
userSchema.methods.createUser = function(username, password, callback) {
    const hash = bcrypt.hashSync(password, 10);
    this.username = username;
    this.password = password;
    const validationErrors = this.validateSync();
    if (validationErrors) {
        const errors = [];
        if (validationErrors.code === 11000) {
            errors.push('This username has been already occupied. Please, choose another one.');
        } else if (validationErrors.name === 'ValidationError') {
            for (let field in validationErrors.errors) {
                errors.push(validationErrors.errors[field].message);
            }
        } else {
            winston.log('error', validationErrors);
            errors.push('Unrecognized DB error');
        }
        return callback(errors);
    }
    this.password = hash;
    this.save().then((newUser) => {
        callback(undefined, newUser);
    }, () => {
        callback(['Unrecognized DB error']);
    });
};

/**
 * Check logging
 *
 * @param username
 * @param password
 * @param callback
 */
userSchema.statics.checkLogin = function(username, password, callback) {
    this.findOne({
        username: username,
    }).exec(function(err, currentUser) {
        if (err) {
            callback(err);
        } else {
            if (currentUser !== null) {
                if (bcrypt.compareSync(password, currentUser.password)) {
                    callback(undefined, currentUser);
                } else {
                    callback('Password is incorrect');
                }
            } else {
                callback('Username does not exist!');
            }
        }
    });
};

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};
