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
    
    // if (user.role === "admin") {
    //   console.log("Admin is authorized");
    //   next();
    // } else {
    //   res.status(401).send("Unauthorized");
    // }
  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
};

// const userAuth = (req, res, next) => {
//   const token = "xyyz";
//   const userAuthorized = token === "xyz";
//   if (userAuthorized) {
//     console.log("User is authorized");
//     next();
//   } else {
//     res.status(401).send("Unauthorized");
//   }
// };

module.exports = { userAuth };
