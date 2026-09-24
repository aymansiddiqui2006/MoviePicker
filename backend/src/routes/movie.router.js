import { Router } from "express";
import { AddMovies, GetMovie, removeSelectedMovie, VoteMovie,WinningMovie} from "../controllers/Movie.controller.js";

const router=Router();


router.post("/:roomCode/:nickname/add",AddMovies)

router.patch("/:roomCode/:nickname/:tmdbId",VoteMovie)

router.delete("/:roomCode/:nickname/movie/:tmdbId",removeSelectedMovie)

router.get("/:roomCode/movies",GetMovie)

router.get("/:roomCode",WinningMovie)

export default router;