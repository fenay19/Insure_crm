const socket = require("socket.io");

const onlineUsers = new Map(); // Keep track of connected users

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  global.io = io; // Expose io globally if needed
  global.onlineUsers = onlineUsers; // Expose onlineUsers map globally

  console.log("Socket server initialized ✅");

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-patient-room", () => {
      socket.join("patient-status-room"); // 👈 Room used in your `emitPatientStatusUpdate`
      console.log(`✅ ${socket.id} joined patient-status-room`);
    });
    socket.on("notification", ({ consultantId }) => {
      const roomId = consultantId; // 👈 Only use consultantId as roomId
      console.log("Joining room:", roomId);
      socket.join(roomId);
    
      // Register consultant's socket
      if (consultantId) {
        onlineUsers.set(consultantId, socket.id);
        console.log(
          `🧠 Mapped consultantId ${consultantId} to socket ${socket.id}`
        );
      }
    });
    

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      // Clean up disconnected socket
      for (const [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
          console.log(`❌ Removed consultantId ${key} from online users`);
        }
      }
    });
  });
};

function emitRightsUpdated(userId) {
  console.log(`Emitting RIGHTS_UPDATED to ${userId}`);
  const roomId = [userId].sort().join("-");
  const socketId = onlineUsers.get(roomId); // Use onlineUsers here instead of connectedUsers
  if (socketId && io) {
    io.to(socketId).emit("RIGHTS_UPDATED");
  } else {
    console.log(` No socket found for roomId: ${roomId}`);
  }
}
function emitPatientRequest(userId, requestData) {
  console.log(`Request sent to userId: ${userId}`);
  const socketId = onlineUsers.get(userId); // ✅ directly use consultantId or userId

  if (socketId && io) {
    io.to(socketId).emit("REQUEST_SEND", requestData); // 🚀 Send payload
    console.log("✅ REQUEST_SEND emitted to socket:", socketId);
  } else {
    console.log(`❌ No socket found for userId: ${userId}`);
  }
}

function emitPatientStatusUpdate(updatedPatient) {
  if (io) {
    io.to("patient-status-room").emit("PATIENT_STATUS_UPDATED", updatedPatient);
    console.log("🟢 Broadcasted PATIENT_STATUS_UPDATED:");
  }
}
function emitPatientApprovedRequest(updatedPatient) {
  if (io) {
    io.to("patient-status-room").emit(
      "PATIENT_APPROVED_REQUEST",
      updatedPatient
    );
    console.log("🟢 Broadcasted PATIENT_APPROVED_REQUEST");
  }
}

module.exports = {
  initilizeSocket,
  onlineUsers,
  emitRightsUpdated,
  emitPatientStatusUpdate,
  emitPatientRequest,
  emitPatientApprovedRequest
};
