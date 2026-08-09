import { io } from "../../app.js";
import { Room } from "../models/Room.model.js";

export const emitRoomUpdate = async (roomCode) => {
  const room = await Room.findOne({ roomCode })
    .populate("host", "nickname ready")
    .populate("members", "nickname ready hasVoted readyToVote moviesSelected");

  io.to(roomCode).emit("room-updated", room);
};

export default emitRoomUpdate;