import { Router } from "express";
import {CreateRoom, getRoom, JoinRoom,readyToAddMovie} from '../controllers/Room.controller.js'

const router=Router();

router.post("/create",CreateRoom);

router.post("/join",JoinRoom);

router.get("/:roomCode",getRoom);

router.patch("/:roomCode/:nickname",readyToAddMovie);

export default router;