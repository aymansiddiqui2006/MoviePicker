import { Router } from "express";
import { AddMovies, GetMovie, VoteMovie,WinningMovie} from "../controllers/Movie.controller.js";

const router=Router();

router.post("/:roomCode/:nickname/add",AddMovies)

router.get("/:roomCode/movies",GetMovie)

router.patch("/:roomCode/:tmdbId/:nickname",VoteMovie)

router.get("/:roomCode",WinningMovie)

export default router;