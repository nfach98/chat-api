const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  users: {
    required: true,
    type: Array,
  },
  name: {
    type: String,
  },
  picture: {
    type: String,
  },
});

module.exports = mongoose.model("Room", dataSchema);
