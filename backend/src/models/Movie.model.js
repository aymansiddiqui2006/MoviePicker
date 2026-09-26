import mongoose, { Schema } from "mongoose";

const MovieSchama = mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  tmdbId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
  },
  votes: {
    type: Number,
    default: 0,
  },
  poster: {
    type: String,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participant",
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 60 * 60 * 1000),
  },
});

MovieSchama.index(
  {
    room: 1,
    tmdbId: 1,
  },
  {
    unique: true,
  },
);

export const Movie = mongoose.model("Movie", MovieSchama);
