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
      enum: ["waiting", "adding_movies", "voting", "counting_vote", "finished"],
      default: "waiting",
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participant",
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

RoomSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

export const Room = mongoose.model("Room", RoomSchema);
