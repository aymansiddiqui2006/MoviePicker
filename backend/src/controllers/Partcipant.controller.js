import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiErrors.js";
import ApiRes from "../utils/ApiRes.js";
import { Participant } from "../models/Participant.model.js";
import { Room } from "../models/Room.model.js";
import { Movie } from "../models/Movie.model.js";

const removeSelectedMovie = AsyncHandler(async (req, res) => {
  const { nickname, roomCode, tmdbId } = req.params;

  const room = await Room.findOne({
    roomCode,
  });

  if (!room) {
    throw new ApiError(400, "room not found");
  }

  if (room.status !== "adding_movies") {
    throw new ApiError(400, "the room is not in movie selecting state");
  }

  const participant = await Participant.findOne({
    room: room._id,
    nickname,
  });

  if (!participant) {
    throw new ApiError(400, "participant not found");
  }

  const movie = await Movie.findOne({
    room: room._id,
    tmdbId,
  });

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  await Participant.findByIdAndUpdate(
    participant._id,
    {
      $pull: {
        moviesSelected: movie._id,
      },
    },
    { new: true },
  );

  await Movie.findByIdAndDelete(movie._id);

  return res.status(200).json(new ApiRes(200, "Movie removed successfully"));
});

const getSelectedSelectedMovie = AsyncHandler(async (req, res) => {
  const { roomCode, nickname } = req.params;

  const room = await Room.findOne({
    roomCode,
  });

  if (!room) {
    throw new ApiError(404, "room not found");
  }

  if (room.status !== "adding_movies") {
    throw new ApiError(401, "room is not in adding movie state");
  }

  const participant = await Participant.findOne({
    room: room._id,
    nickname,
  }).populate("moviesSelected");

  if (!participant) {
    throw new ApiError(404, "participant not found");
  }

  const movies = participant.moviesSelected || [];


  return res.status(200).json(new ApiRes(200, movies, "movie fetched"));
});

export { removeSelectedMovie, getSelectedSelectedMovie };
