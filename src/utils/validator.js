const validate = require("validator");

const validatesignup = (req) => {
  const { name, email, password, age, gender } = req.body;

  if (!name || !email || !password || !age) {
    if (!name) {
      return "Name is required";
    }
    if (!email) {
      return "Email is required";
    }
    if (!password) {
      return "Password is required";
    }
    if (!age) {
      return "Age is required";
    }
  }

  if (name.length < 4) {
    return "Name must be at least 4 characters long";
  }

  if (!validate.isEmail(email)) {
  return "Invalid Email ";
  }

  if (!validate.isStrongPassword(password)) {
    return "Create a strong password";
  }

  if (!validate.isInt(age)) {
    return "Age must be an integer";
  }
  if (gender){
    if (!["male", "female", "other"].includes(gender.toLowerCase())) {
      return (
        "Invalid gender. Accepted values are: male, female, other."
      );
    }
  }
  

  return null; 
};

const validateEditProfile = (req) => {
  const { name, password, age } = req.body;

  if (name.length < 4) {
    return "Name must be at least 4 characters long";
  }

  if (!validate.isStrongPassword(password)) {
    throw new Error("Create a strong password");
  }

  if (!validate.isInt(age) ) {
    throw new Error("Age must be an integer");
  }

  return null; // No error
};


module.exports = {validatesignup, validateEditProfile};
