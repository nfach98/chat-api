require("dotenv").config();
const mongoose = require("mongoose");

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

class MongoDatabase {
  static init() {
    database.on("error", (error) => {
      console.log(error);
    });

    database.once("connected", () => {
      console.log("Database Connected");
    });
  }
}

module.exports = MongoDatabase;
