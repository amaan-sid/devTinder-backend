const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { sessionToken } = cookie;
    if (!sessionToken) {
      throw new Error("Session Token not found");
    }
    const data = await jwt.verify(sessionToken, "Amaan@9450");
    // console.log(data);
    const user = await User.findById(data.id);
    if (!user) {
      throw new Error("User not found");
    }
    else {
      req.user = user;
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
};

module.exports = { userAuth };
