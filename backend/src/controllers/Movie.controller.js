import { Movie } from "../models/Movie.model.js";
import ApiError from "../utils/ApiErrors.js";
import ApiRes from "../utils/ApiRes.js";
import AsyncHandler from "../utils/AsyncHandler.js";

import { Room } from "../models/Room.model.js";
import { Participant } from "../models/Participant.model.js";

import emitRoomUpdate from '../helper/emitChange.js'
import { io } from "../../app.js";

const AddMovies = AsyncHandler(async (req, res) => {
  const { roomCode, nickname } = req.params;
  const { tmdbId, poster, title } = req.body;

  if (!tmdbId || !title) {
    throw new ApiError(400, "tmdbId and title are required");
  }

  const room = await Room.findOne({
    roomCode,
  });

  if (!room) {
    throw new ApiError(400, "room not found!!");
  }

  if (room.status !== "adding_movies") {
    throw new ApiError(400, "Movie selection is closed");
  }

  const participant = await Participant.findOne({
    room: room._id,
    nickname,
  });

  if (!participant) {
    throw new ApiError(404, "Participant not found");
  }

  const exists = await Movie.findOne({
    room: room._id,
    tmdbId,
  });

  if (exists) {
    throw new ApiError(409, "Movie already added");
  }

  if (participant.moviesSelected.length >= 2) {
    throw new ApiError(400, "You can only add 2 movies");
  }

  const addMovie = await Movie.create({
    room: room._id,
    addedBy: participant._id,
    tmdbId,
    poster,
    title,
  });

  participant.moviesSelected.push(addMovie._id);
  await participant.save();

  await emitRoomUpdate(roomCode);

  return res
    .status(201)
    .json(new ApiRes(201, addMovie, "Movie added successfully"));
});

const GetMovie = AsyncHandler(async (req, res) => {
  const { roomCode } = req.params;

  const room = await Room.findOne({
    roomCode,
  });

  if (!room) {
    throw new ApiError(409, "Room not exits");
  }

  const movies = await Movie.find({
    room: room._id,
  }).populate("addedBy", "nickname");

  return res
    .status(200)
    .json(new ApiRes(200, movies, "Movies fetched successfully"));
});

const VoteMovie = AsyncHandler(async (req, res) => {
  const { roomCode, tmdbId, nickname } = req.params;

  const room = await Room.findOne({
    roomCode,
  });

  if (!room) {
    throw new ApiError(409, "Room not exits");
  }

  if (room.status !== "voting") {
    throw new ApiError(400, "the voting phase is not started");
  }

  const participant = await Participant.findOne({
    nickname,
    room: room._id,
  });

  if (!participant) {
    throw new ApiError(409, "participant not exits");
  }

  if (participant.hasVoted) {
    throw new ApiError(409, "Participant already voted !!");
  }

  const movie = await Movie.findOne({
    room: room._id,
    tmdbId,
  });

  if (!movie) {
    throw new ApiError(404, "Movie not found");
  }

  movie.votes++;
  await movie.save();

  participant.hasVoted = true;
  await participant.save();

  await emitRoomUpdate(roomCode);

  return res
    .status(200)
    .json(new ApiRes(200, movie, "Vote submitted successfully"));
});

const WinningMovie = AsyncHandler(async (req, res) => {
  const { roomCode } = req.params;

  // Find Room
  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  if (room.status !== "counting_vote") {
    throw new ApiError(400, "counting has not started");
  }

  // Find all movies sorted by votes
  const movies = await Movie.find({
    room: room._id,
  }).sort({ votes: -1 });

  if (movies.length === 0) {
    throw new ApiError(404, "No movies found");
  }

  // Highest voted movie
  const highestVotes = movies[0].votes;

  // Check for tie
  const winners = movies.filter((movie) => movie.votes === highestVotes);

  io.to(roomCode).emit("result-updated", winners);

  return res.status(200).json(
    new ApiRes(
      200,
      {
        winner: winners,
      },
      "Voting finished successfully",
    ),
  );
});

export { AddMovies, GetMovie, VoteMovie, WinningMovie };
