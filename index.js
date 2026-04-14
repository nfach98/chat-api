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

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Chat Server API", status: "online" });
});

app.get("/health", (req, res) => {
  const dbStatus = MongoDatabase.getStatus();
  const dbStateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  
  res.status(200).json({
    status: "UP",
    server: "running",
    database: dbStateMap[dbStatus] || "unknown",
    timestamp: new Date().toISOString()
  });
});

const port = process.env.PORT || 3000;

server.listen(port, "0.0.0.0", () => {
  console.log(`Server Started at ${port}`);
});

module.exports = app;
