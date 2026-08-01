import { Router } from "express";
import {CreateRoom, getRoom, JoinRoom} from '../controllers/Room.controller.js'

const router=Router();

router.post("/create",CreateRoom);

router.post("/join",JoinRoom);

router.get("/:roomCode",getRoom);

export default router;