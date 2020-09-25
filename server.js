const server = require("http").createServer();
const io = require("socket.io")(server);

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Room = require("./models/Room");
const Message = require("./models/Message");

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const LOAD_ROOM = "loadRoom";
const LOAD_MESSAGE_FROM_ROOM = "loadMessageFromRoom";

io.on("connection", async (socket) => {
  // Load Room has exist
  socket.on(LOAD_ROOM, async () => {
    const data = await Room.find({ status: "ACTIVE" })
      .select("name isLock")
      .sort({ createAt: "desc" });
    io.emit(LOAD_ROOM, data);
  });

  // Join a conversation
  const { roomId, name } = socket.handshake.query;

  socket.join(roomId);

  // Load Message from room
  socket.on(LOAD_MESSAGE_FROM_ROOM, async (id) => {
    const data = await Message.find({ status: "ACTIVE", room: id }).select(
      "name createAt message "
    );
    io.emit(LOAD_MESSAGE_FROM_ROOM, data);
  });

  // Check room is exists
  const room = await Room.find({
    name: roomId,
  }).countDocuments();

  let currentRoom = [];

  if (
    room < 1 &&
    (roomId !== undefined || roomId !== "" || roomID !== "undefined")
  ) {
    const createRoom = await Room.create({
      name: roomId,
      password: "",
      isLock: "NO",
    });
    currentRoom = createRoom;
  } else {
    const createRoom = await Room.find({
      name: roomId,
    });
    currentRoom = createRoom;
  }

  // Listen for new message
  socket.on(NEW_CHAT_MESSAGE_EVENT, async (data) => {
    let response = `${name}: ${data.body}`;
    data.body = response;
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    const msg = await Message.create({
      name,
      room: roomId,
      message: data.body,
    });
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });

  socket.on("end", function () {
    socket.disconnect(0);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
