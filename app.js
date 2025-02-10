const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./src/middlewares/auth");
const {connectdb} = require("./src/config/Database");
const User = require("./src/models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  // console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send('user added successfully');
  }
  catch (err) {
    console.log(err);
    res.status(400).send('Error saving the user');
  }
})

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




