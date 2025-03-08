const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user");
const connectionRequestModel = require("../models/connectionRequest");

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests =  connectionRequestModel.find({
        toUserId: loggedInUser.id,
        status: "interested",
    }).populate("fromUserId", "name");
    
    const data = await connectionRequests;
    res.json({
      message: "Getting the requests",
      data,
    });

  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
   
  const loggedInUser = req.user;
  try{
    const connections = await connectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser.id, status: "accepted" },
        { fromUserId: loggedInUser.id, status: "accepted" },
      ],
    }).populate("fromUserId", "name")

    const data = connections.map((connection) => connection.fromUserId);

    res.json({
      message: "Getting the connections",
      data,
    });

  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    const connections = await connectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser.id },
        { fromUserId: loggedInUser.id },
      ],
    })

    const data = await UserModel.find({
      _id: { $nin: [loggedInUser.id, connections.toUserId] },
    });

    res.json({
      message: "Getting the feed",
      data,
    });

  } catch (err) {
    console.log(err);
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = userRouter;