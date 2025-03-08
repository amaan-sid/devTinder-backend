const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validatesignup } = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  // console.log(req.body);

  try {

    const { name, email, password, age, gender, photoURL } = req.body;

    const error = validatesignup(req);
    if (error) {
      return res.status(400).json({ error });
    }

    const passwordHash = await bcrypt.hash(password, 8);

    const user = new User({
      name,
      email,
      password: passwordHash,
      age,
      gender,
      photoURL,
    });
    await user.save();
    const token = await user.getJWT();
    res.cookie("sessionToken", token);
    res.send("User created successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { name, email, password, age } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("User not found in database");
    }
    const isMatchPassword = await user.validatePassword(password);

    if (!isMatchPassword) {
      throw new Error("Invalid Password");
    } else {
      const token = await user.getJWT();
      //   console.log(token);
      res.cookie("sessionToken", token);
      res.send({message: "Login Successful", user});
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.clearCookie("sessionToken");
    res.send("Logout Successfull");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = authRouter;
