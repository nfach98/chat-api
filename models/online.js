const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataSchema = new Schema(
  {
    user: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isOnline: Boolean,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Online", dataSchema);
