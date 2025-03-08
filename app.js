const express = require("express");
const app = express();
const { connectdb } = require("./src/config/Database");
// const User = require("./src/models/user");
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/requests");
const userRouter = require("./src/routes/user");
const cookieParser = require("cookie-parser");
const cors = require("cors")
// const jwt = require("jsonwebtoken");
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    // origin:"http://localhost:5173",
    origin: allowedOrigins,
    credentials: true,
  }
))

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
