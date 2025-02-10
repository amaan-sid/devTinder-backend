 const adminAuth =  (req, res,next) => {
  const token = "xyz";
  const userAuthorized = token === "xyz";
  if (userAuthorized) {
    console.log("admin is authorized");
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

const userAuth =  (req, res,next) => {
    const token = "xyyz";
    const userAuthorized = token === "xyz";
    if (userAuthorized) {
      console.log("User is authorized");
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  }


module.exports = {adminAuth, userAuth}