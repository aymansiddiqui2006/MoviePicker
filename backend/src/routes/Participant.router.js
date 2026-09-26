import { Router } from "express";
import { getSelectedSelectedMovie, removeSelectedMovie } from "../controllers/Partcipant.controller.js";

const router=Router();


router.delete("/:roomCode/:nickname/movie/:tmdbId",removeSelectedMovie)

router.get("/:roomCode/:nickname/movies/selected",getSelectedSelectedMovie)

export default router