const mongoose = require("mongoose");
var validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
  },
  skills: {
    type: Array,
    default: [],
  },
  photoURL: {
    type: String,
    default: "https://media.istockphoto.com/id/476085198/photo/businessman-silhouette-as-avatar-or-default-profile-picture.jpg?s=2048x2048&w=is&k=20&c=VoujUFmrZr64WwE6MZQAt0Sa0KqlqKXdl35SewxD1WU=",
  }
},
{timestamps: true}
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ id: user.id }, "Amaan@9450", { expiresIn: "1d" });
  return token;
}

userSchema.methods.validatePassword = async function (passwordBYUser) {
  const user = this;
  const isMatch = await bcrypt.compare(passwordBYUser, user.password);
  return isMatch;
}
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
