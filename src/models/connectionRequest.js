const e = require("express");
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    required : true,
    default: "interested",
    enum:{
      values: ["ignored", "interested", "accepted", "rejected"],
      message: "{VALUE} is not supported",
    } ,
  },
},
{
  timestamps: true,
}
);

// connectionRequestSchema.pre("save", async function (next) {
//   const connectionRequest = this;
//   if (connectionRequest.isModified("status")) {
//     if (connectionRequest.status === "accepted") {
//       const existingRequest = await connection
//       Request.findOne({
//         fromUserId: connectionRequest.toUserId,
//         toUserId: connectionRequest.fromUserId,
//         status: "accepted",
//       });
//       if (existingRequest) {
//         throw new Error("Connection already exists");
//       }
//     }
//   }
//   next();
// }
// );

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

const connectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = connectionRequestModel;
