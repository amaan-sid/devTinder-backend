const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  
  try {
    
    const AllowedUpdates = ["name", "password", "age", "skills", "photoURL", "gender"];

    const isUpdateAllowed = Object.keys(req.body).every((update) => {
      return AllowedUpdates.includes(update);
    });

    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid Update");
    }

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
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

profileRouter.delete("/profile/delete", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    await user.deleteOne();
    res.send({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(400).send("Error" + error.message);
  }
});

module.exports = profileRouter;
