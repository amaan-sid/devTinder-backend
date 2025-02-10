const mongoose = require("mongoose");

const uri =
  "mongodb+srv://amaan_sid:Mongodb%400071@cluster0.mwdft.mongodb.net/dev";
  
const connectdb = async () => {
  await mongoose.connect(uri);
};
module.exports = {connectdb};

