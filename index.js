require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const authRouter = require("./routes/auth.router");
const chatRouter = require("./routes/chat.router");
const fileRouter = require("./routes/file.router");

const ChatWebsocket = require("./websockets/chat.websocket");
const MongoDatabase = require("./databases/mongo.database");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/file", fileRouter);
app.use("/uploads", express.static("uploads"));

MongoDatabase.init();
ChatWebsocket.init(server);

const port = process.env.PORT || 3000;

server.listen(port, "0.0.0.0", () => {
  console.log(`Server Started at ${port}`);
});

module.exports = app;
