import mongoose, { Schema } from "mongoose";
import { Room } from "./Room.model";

const ParticipantSchema = mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    ready: {
      type: Boolean,
      default: false,
    },
    hasVoted: {
      type :Boolean,
      default:false
    }
  },
  { timestamps: true },
);

export const Participant = mongoose.model("Participant", ParticipantSchema);
