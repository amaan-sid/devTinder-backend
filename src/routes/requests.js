const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const fromUserId = loggedInUser.id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status " + status,
        });
      }

      if (fromUserId === toUserId) {
        return res.status(400).json({
          message: "You cannot send request to yourself",
        });
      }

      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const existingRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).json({
          message: "Request already exists",
        });
      }

      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: loggedInUser.name + " sent request to " + toUser.name,
        data,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send("Error : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status " + status,
        });
      }

      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser.id,
        status: "interested",
      });
      if (!connectionRequest) {
        // console.log(requestId +"   " + loggedInUser.id + status);
        return res.status(400).json({
          message: "Request not found",
        });
      }
      connectionRequest.status = status;
      // console.log(connectionRequest);

      const data = await connectionRequest.save();

      // console.log(data);
      res.json({
        message: "Request reviewed",
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

module.exports = requestRouter;
