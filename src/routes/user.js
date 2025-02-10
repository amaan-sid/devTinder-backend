const express = require("express");
const router = express.Router();

const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstname lastaname photoUrl age gender about skills";

// Get all pending connection requests

// router.get("/user/requests/recieved", userAuth, async (req, res) => {
//   try {
//       const loggedInUser = req.user;

//     const connectionRequests = await connectionRequest.find({
//       toUserId: loggedInUser._id,
//       status: "interested",
//     }).populate("fromUserId", USER_SAFE_DATA);

//     res.json({
//         message: "Data Fetched Successfully",
//         data : connectionRequests,
//     })

//     // res.send(requests);
//   } catch (error) {
//     res.statusCode(400).send("Error" + error.message);
//   }
// });

// router.get("/user/connections", userAuth, async (req, res) => {
//     try {
//         const loggedInUser = req.user;
  
//       const connectionRequests = await connectionRequest.find({
//         $or: [
//         {toUserId: loggedInUser._id,
//         status: "accepted"},
//         {fromUserId: loggedInUser._id,
//         status: "accepted"},
//     ],
//       })
//       .populate("fromUserId", USER_SAFE_DATA)
//         .populate("toUserId", USER_SAFE_DATA);

//         console.log(connectionRequests);
  
//       res.json({
//           message: "Data Fetched Successfully",
//           data : connectionRequests,
//       })
  
//       // res.send(requests);
//     } catch (error) {
//       res.statusCode(400).send("Error" + error.message);
//     }
//   });

router.get("/feed", userAuth, async (req, res) => { 
    try {
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequest.find({
            $or: [
            {toUserId: loggedInUser._id},
            {fromUserId: loggedInUser._id},
        ],
        }).select("fromUserId toUserId status");
        res.send(connectionRequests);
        // .populate("fromUserId", USER_SAFE_DATA)
        // .populate("toUserId", USER_SAFE_DATA);

        // const userIds = connectionRequests.map((connectionRequest) => {
        //     if (connectionRequest.fromUserId._id.toString() === loggedInUser._id.toString()) {
        //         return connectionRequest.toUserId._id;
        //     } else {
        //         return connectionRequest.fromUserId._id;
        //     }
        // });

        // const feed = await User.find({
        //     _id: { $in: userIds },
        // });

        // res.json({
        //     message: "Data Fetched Successfully",
        //     data : feed,
        // });
    } catch (error) {
        res.statusCode(400).json({message : error.message});
    } 
})

module.exports = router,