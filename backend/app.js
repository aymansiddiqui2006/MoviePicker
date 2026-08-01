import express from "express";
import roomRouter from "./src/routes/Room.route.js"
import movieRouter from "./src/routes/movie.router.js"

const app=express();

app.use(express.json()); 

app.use("/api/v1/room",roomRouter)

app.use("/api/v1/movie",movieRouter)

export default app;