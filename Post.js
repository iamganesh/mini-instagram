const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    caption: { type: String, default: "", trim: true },
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", schema);