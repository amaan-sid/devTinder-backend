const validate = require("validator");

const validatesignup = (req) => {
  const { name, email, password, age } = req.body;

  if (name.length < 4) {
    return "Name must be at least 4 characters long";
  }

  if (!validate.isEmail(email)) {
    throw new Error("Invalid Email by");
  }

  if (!validate.isStrongPassword(password)) {
    throw new Error("Create a strong password");
  }

  return null; // No error
};

module.exports = {validatesignup};
