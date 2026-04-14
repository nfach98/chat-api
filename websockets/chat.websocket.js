const url = require("url");
const { WebSocketServer } = require("ws");

const { decodeToken } = require("../utils/tokenizer");
const ChatService = require("../services/chat.service");
const OnlineRepository = require("../repositories/online.repository");
const RoomRepository = require("../repositories/room.repository");

class ChatWebsocket {
  static async init(server) {
    const sockserver = new WebSocketServer({ server, path: "/chat" });
    sockserver.on("connection", async (ws, req) => {
      const parameters = url.parse(req.url, true);
      const token = parameters.query.token;
      const userId = decodeToken(token);

      if (userId) {
        ws.id = userId;

        // Set user as online
        await OnlineRepository.upsertUserStatus(userId, true);

        ws.on("message", async (message) => {
          try {
            const roomId = parameters.query.room;

            // Save the chat message
            const chatData = {
              message: message,
              sentBy: userId,
              room: roomId,
            };

            const savedChat = await ChatService.saveMessage(chatData);

            // Update room subtitle
            await RoomRepository.updateById(roomId, { subtitle: message });

            // Get room to find users
            const room = await RoomRepository.findById(roomId);
            const users = room.users;

            // Send message to other users in the room
            sockserver.clients.forEach((client) => {
              if (users.includes(client.id) && client.id !== userId) {
                client.send(JSON.stringify(savedChat));
              }
            });
          } catch (error) {
            console.error("Error handling message:", error);
          }
        });

        ws.on("close", async () => {
          try {
            await OnlineRepository.upsertUserStatus(userId, false);
          } catch (error) {
            console.error("Error updating user offline status:", error);
          }
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
