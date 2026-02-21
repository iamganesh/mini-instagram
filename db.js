const mongoose = require("mongoose");

module.exports = async function () {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");
};