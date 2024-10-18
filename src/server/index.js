const app = require("express")();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",

    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`사용자 ${socket.id} 연결됨`); // 방 참가

  socket.on("joinRoom", (room_no) => {
    socket.join(room_no);

    console.log(`${socket.id}가 방 ${room_no}에 참가함`);
  }); // 메시지를 특정 방에 있는 사용자에게 전송

  socket.on("sendMessage", ({ room_no, name, message }) => {
    socket.broadcast.to(room_no).emit("receiveMessage", { name, message });

    console.log(`방 ${room_no}에 메시지: ${message}`);
  });

  socket.on("leaveRoom", (room_no) => {
    socket.leave(room_no);

    console.log(`${socket.id}가 방 ${room_no}에서 나감`);
  }); // 소켓 연결 해제 시

  socket.on("disconnect", () => {
    console.log(`사용자 ${socket.id} 연결 해제됨`);
  });
});

server.listen(4000, function () {
  console.log("서버가 4000 포트에서 실행 중");
});
