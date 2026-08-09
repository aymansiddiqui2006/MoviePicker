import ApiError from "../utils/ApiErrors.js";
import ApiRes from "../utils/ApiRes.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { Room } from "../models/Room.model.js";
import { Participant } from "../models/Participant.model.js";



import emitRoomUpdate from '../helper/emitChange.js'

const CreateRoom = AsyncHandler(async (req, res) => {
  const { roomName, nickname } = req.body;

  if (!roomName || !nickname) {
    throw new ApiError(400, "Room name and nickname are required");
  }

  const char = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";

  const generatecode = () => {
    let code = "";
    for (let i = 0; i < 6; i++) {
      const generateIndex = Math.floor(Math.random() * char.length);
      code += char[generateIndex];
    }
    return code;
  };

  let roomCode;
  let exists = true;

  while (exists) {
    roomCode = generatecode();

    exists = await Room.findOne({ roomCode });
  }

  const createdRoomData = await Room.create({
    roomName,
    roomCode,
  });

  const host = await Participant.create({
    nickname,
    room: createdRoomData._id,
  });

  createdRoomData.host = host._id;
  createdRoomData.members.push(host._id);

  await createdRoomData.save();

  await emitRoomUpdate(roomCode);

  return res.status(201).json(new ApiRes(201, createdRoomData, "room created"));
});

const JoinRoom = AsyncHandler(async (req, res) => {
  const { roomCode, nickname } = req.body;

  const findRoom = await Room.findOne({ roomCode });
  if (!findRoom) {
    throw new ApiError(404, "room not exists");
  }

  const nicknameExists = await Participant.findOne({
    room: findRoom._id,
    nickname,
  });

  if (nicknameExists) {
    throw new ApiError(401, "nick name already exists!");
  }

  const data = await Participant.create({
    nickname,
    room: findRoom._id,
  });

  findRoom.members.push(data._id);
  await findRoom.save();

  await emitRoomUpdate(roomCode);

  return res.status(201).json(new ApiRes(201, data, "room joined"));
});

const getRoom = AsyncHandler(async (req, res) => {
  const { roomCode } = req.params;

  const room = await Room.findOne({
    roomCode,
  })
    .populate("host", "nickname ready")
    .populate("members", "nickname ready hasVoted readyToVote moviesSelected");

  if (!room) {
    throw new ApiError(404, "room not fethed");
  }

  return res.status(200).json(new ApiRes(200, room, "room fetched!!"));
});

const readyToAddMovie = AsyncHandler(async (req, res) => {
  const { roomCode, nickname } = req.params;

  const room = await Room.findOne({
    roomCode,
  });

  if (!room) {
    throw new ApiError(409, "Room does not exits!");
  }

  const participant = await Participant.findOne({
    room: room._id,
    nickname,
  });

  if (!participant) {
    throw new ApiError(404, "Participant not found");
  }

  participant.ready = true;
  await participant.save();

  const participants = await Participant.find({
    room: room._id,
  });

  const CheckEveryoneIsReady = await participants.every(
    (participant) => participant.ready,
  );

  if (CheckEveryoneIsReady) {
    room.status = "adding_movies";
    await room.save();
  }

  await emitRoomUpdate(roomCode);

  return res.status(200).json(
    new ApiRes(
      200,
      {
        participant,
        roomStatus: room.status,
      },
      "Ready status updated",
    ),
  );
});

const VotingStarted = AsyncHandler(async (req, res) => {
  const { roomCode, nickname } = req.params;

  const findRoom = await Room.findOne({ roomCode });
  if (!findRoom) {
    throw new ApiError(404, "room not exists");
  }

  const participant = await Participant.findOne({
    nickname,
    room: findRoom._id,
  });

  if (!participant) {
    throw new ApiError(404, "participant not exits");
  }

  if (findRoom.host.toString() !== participant._id.toString()) {
    throw new ApiError(403, "Only the host can start voting");
  }

  if (findRoom.status !== "adding_movies") {
    throw new ApiError(400, "Room is not ready for voting");
  }

  findRoom.status = "voting";
  await findRoom.save();

  await emitRoomUpdate(roomCode);

  return res.status(200).json(new ApiRes(200, findRoom, "status updated!"));
});

const WinningCountStart = AsyncHandler(async (req, res) => {
  const { roomCode, nickname } = req.params;

  // Find Room
  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Check participant
  const participant = await Participant.findOne({
    nickname,
    room: room._id,
  });

  if (!participant) {
    throw new ApiError(404, "Participant not found");
  }

  // Only host can finish voting
  if (room.host.toString() !== participant._id.toString()) {
    throw new ApiError(403, "Only host can finish voting");
  }

  // Room must be in voting state
  room.status = "counting_vote";
  await room.save();

  await emitRoomUpdate(roomCode);

  return res
    .status(200)
    .json(new ApiRes(200, room, "Voting finished successfully"));
});

const participantReadyToVote = AsyncHandler(async (req, res) => {
  const { roomCode, nickname } = req.params;

  // Find Room
  const room = await Room.findOne({ roomCode });

  if (!room) {
    throw new ApiError(404, "Room not found");
  }

  // Check participant
  const participant = await Participant.findOne({
    nickname,
    room: room._id,
  });

  if (!participant) {
    throw new ApiError(404, "Participant not found");
  }

  participant.readyToVote = true;
  await participant.save();

  await emitRoomUpdate(roomCode);

  return res
    .status(200)
    .json(new ApiRes(200, participant, "Voting finished successfully"));
});

export {
  CreateRoom,
  JoinRoom,
  getRoom,
  readyToAddMovie,
  VotingStarted,
  WinningCountStart,
  participantReadyToVote,
};
