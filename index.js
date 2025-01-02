require("dotenv").config();
const express = require("express");

const app = express();
const authRouter = require("./routes/auth.router");
const chatRouter = require("./routes/chat.router");
const fileRouter = require("./routes/file.router");

const ChatWebsocket = require("./websockets/chat.websocket");
const MongoDatabase = require("./databases/mongo.database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/file", fileRouter);
app.use("/uploads", express.static("uploads"));

MongoDatabase.init();
ChatWebsocket.initWebsocket();

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
