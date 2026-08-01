import { Router } from "express";
import {CreateRoom, getRoom, JoinRoom,readyToAddMovie,VotingStarted,WinningCountStart} from '../controllers/Room.controller.js'

const router=Router();

router.post("/create",CreateRoom);

router.post("/join",JoinRoom);

router.patch("/:roomCode/:nickname/vote",VotingStarted);

router.patch("/:roomCode/:nickname/end-voting", WinningCountStart);

router.patch("/:roomCode/:nickname",readyToAddMovie);

router.get("/:roomCode",getRoom);




export default router;