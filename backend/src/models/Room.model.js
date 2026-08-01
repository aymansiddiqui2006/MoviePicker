import mongoose, { Schema } from "mongoose";

const RoomSchema = mongoose.Schema(
  {
    roomCode: {
      type: String,
      unique: true,
      required: true,
    },
    roomName: {
      type: String,
      default: "Movie Night",
    },
    status: {
      type: String,
      enum: ["waiting", "adding_movies", "voting", "finished"],
      default: "waiting",
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
      },
    ],
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Room = mongoose.model("Room", RoomSchema);
