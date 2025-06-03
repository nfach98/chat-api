const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    picture: String,
    title: String,
    subtitle: String,
    countUnread: Number,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Room", dataSchema);
