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
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
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
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
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
