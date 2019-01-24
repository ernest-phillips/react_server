const mongoose = require("mongoose");
const Joi = require("joi");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
});

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    first_name: this.first_name,
    last_name: this.last_name,
    email: this.email,
    username: this.username
  };
};


userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
}

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

const UserJoiSchema = Joi.object().keys({
    first_name: Joi.string().min(1).trim().required(),
    last_name: Joi.string().min(1).trim(),
    username: Joi.string().alphanum().min(4).trim().required(),
    email: Joi.string().email().trim().required();

});

const User = mongoose.model('User', userSchema);

module.exports = { User, UserJoiSchema}