import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import roomRouter from "./src/routes/Room.route.js";
import movieRouter from "./src/routes/movie.router.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

io.on("connection", (socket) => {

    socket.on("join-room", (roomCode) => {

        socket.join(roomCode);

    });

});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/room", roomRouter);

app.use("/api/v1/movie", movieRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export { io };
export default server;
