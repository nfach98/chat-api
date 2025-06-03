const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataSchema = new Schema(
  {
    message: {
      required: true,
      type: String,
    },
    room: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    sentBy: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isSelf: Boolean,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Chat", dataSchema);
