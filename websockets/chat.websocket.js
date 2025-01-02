const url = require("url");
const moment = require("moment-timezone");
const { WebSocketServer } = require("ws");
const sockserver = new WebSocketServer({ port: 443, path: "/chat" });

const { decodeToken } = require("../utils/tokenizer");

const Room = require("../models/room");

class ChatWebsocket {
  static async initWebsocket() {
    sockserver.on("connection", async (ws, req) => {
      const parameters = url.parse(req.url, true);
      const token = parameters.query.token;
      const id_user = decodeToken(token);
      // const id_room = parameters.query.id_room;
      ws.id = id_user;

      // const room = await Room.findById(id_room);
      // const users = room.users.filter((user) => user !== id_user);

      // ws.on("close", () => console.log("Client has disconnected!"));
      ws.on("message", (data) => {
        sockserver.clients.forEach((client) => {
          if (client.id !== id_user) {
            const timestamp = moment()
              .tz("Etc/GMT")
              .format("YYYY-MM-DD HH:mm:ss");
            const chat = JSON.parse(data);
            chat.id_user = id_user;
            chat.timestamp = `${timestamp}`;

            client.send(JSON.stringify(chat));
          }
        });
      });

      ws.onerror = function () {
        console.log("websocket error");
      };
    });
  }
}

module.exports = ChatWebsocket;
