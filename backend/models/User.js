const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator'); //plugin mongoose unique validator

const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true }, //unique to prevent the user using the same email address to create another account
	password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //implement by plugin the method unique validator
module.exports = mongoose.model('User', userSchema);