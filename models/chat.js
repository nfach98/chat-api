const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  message: {
    required: true,
    type: String,
  },
  room: {
    required: true,
    type: String,
  },
  user: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("Chat", dataSchema);
