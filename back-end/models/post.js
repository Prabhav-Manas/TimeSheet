const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  date: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("posts", postSchema);
