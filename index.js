const io = require("socket.io")(8900, {
  cors: {
    origin: "https://tucanteach.ml",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, img }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
      img,
    });
  });

  socket.on("logout", (userId) => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
