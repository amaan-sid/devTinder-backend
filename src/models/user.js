const mongoose = require("mongoose");
var validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 4,
  },
  email: {
    type: String,
    required: true,
  //   validate(value) {
  //   if (!validator.isEmail(value)) {
  //     throw new Error('Invalid Email');
  //   }
  // }
},
  password: {
    type: String,
    required: true,
    validator(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Create a strong password");
      }
    }
  },
  gender: {
    type: String,
    // required: true,
    validate(value) {
      if (!["male", "female", "other"].includes(value.toLowerCase())) {
        throw new Error(
          "Invalid gender. Accepted values are: male, female, other."
        );
      }
    },
  },
  skills: {
    type: Array,
    default: [],
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
