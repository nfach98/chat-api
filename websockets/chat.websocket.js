const url = require("url");
const { WebSocketServer } = require("ws");

const { decodeToken } = require("../utils/tokenizer");
const Room = require("../models/room");
const Chat = require("../models/chat");
const Online = require("../models/online");

const sockserver = new WebSocketServer({ port: 443, path: "/chat" });

class ChatWebsocket {
  static async init() {
    sockserver.on("connection", async (ws, req) => {
      const parameters = url.parse(req.url, true);
      const token = parameters.query.token;
      const idUser = decodeToken(token);

      if (idUser) {
        ws.id = idUser;

        await Online.replaceOne(
          { user: idUser },
          { isOnline: true, user: idUser },
          { upsert: true }
        );

        ws.on("message", async (message) => {
          const idRoom = parameters.query.room;

          const chat = new Chat({
            message: message,
            sentBy: idUser,
            room: idRoom,
          });

          const saved = await chat.save();
          const room = await Room.findOneAndUpdate(
            { _id: idRoom },
            { subtitle: message }
          );

          const users = room.users;
          sockserver.clients.forEach((client) => {
            if (users.includes(client.id) && client.id !== idUser) {
              client.send(JSON.stringify(saved));
            }
          });
        });
        ws.on("close", async () => {
          await Online.replaceOne(
            { user: idUser },
            { isOnline: false, user: idUser },
            { upsert: true }
          );
        });

        ws.onerror = function () {
          console.log("websocket error");
        };
      } else {
        ws.close();
      }
    });
  }
}

module.exports = ChatWebsocket;
