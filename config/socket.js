let io;
let liveUsers = new Map(); // socketId -> { lat, lng, address? }

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*", // ✅ Change this to your frontend origin in production
      methods: ["GET", "POST", "PUT"]
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // 🌍 Handle location tracking
    socket.on("userLocation", (location) => {
      liveUsers.set(socket.id, location); // { lat, lng, address? }
      broadcastLiveUsers();
    });

    // 📢 Optional: Alert acknowledgment (future use)
    socket.on("acknowledge-alert", (alertId) => {
      console.log(`✅ Alert acknowledged by ${socket.id}: ${alertId}`);
    });

    // ❌ Disconnect cleanup
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      liveUsers.delete(socket.id);
      broadcastLiveUsers();
    });
  });
};

// 🟢 Broadcast list of live users to all clients
const broadcastLiveUsers = () => {
  const usersArray = Array.from(liveUsers.values());
  io.emit("liveUsers", usersArray);
};

// 🔌 Allow other modules to emit events
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };
