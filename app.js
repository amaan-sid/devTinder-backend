const express = require("express");
const app = express();
const { userAuth } = require("./src/middlewares/auth");
const { connectdb } = require("./src/config/Database");
const User = require("./src/models/user");
const { validatesignup } = require("./src/utils/validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  // console.log(req.body);

  try {
    const { name, email, password, age } = req.body;

    const passwordHash = await bcrypt.hash(password, 8);

    const user = new User({
      name,
      email,
      password: passwordHash,
      age,
    });
    validatesignup(req);
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

app.post("/login", async (req, res) => {
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
      // console.log(token);
      res.cookie("sessionToken", token);
      res.send("Login Successfull");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.name + " has sent a connection request");
  } catch (err) { 
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

app.get("/user", async (req, res) => {
  // console.log(req.body);
  // const user =  User.find({email: req.body.email});
  try {
    // await user.save();
    const user = await User.find({ email: req.body.email });
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error saving the user");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

app.patch("/user", async (req, res) => {
  // runValidators: true;
  try {
    const AllowedUpdates = ["email", "password", "age"];

    const isUpdateAllowed = Object.keys(req.body).every((update) => {
      return AllowedUpdates.includes(update);
    });

    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid Update");
    }

    const user = await User.findByIdAndUpdate(req.body.id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).send("Upadte Failed" + error.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    // const {id} = req.body
    const user = await User.findByIdAndDelete(req.body.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

connectdb()
  .then(() => {
    console.log("Connected to Database");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error in connecting Database", err);
  });
