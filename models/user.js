const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  picture: {
    type: String,
  },
});

schema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validPassword = (password) => {
  var result = false;
  bcrypt.compare(password, this.password, (res) => {
    console.log(res);
    result = res;
  });

  return result;
};

module.exports = mongoose.model("User", schema);
