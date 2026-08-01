import express from "express";
import roomRouter from "./src/routes/Room.route.js"

const app=express();

app.use(express.json()); 

app.use("/api/v1/room",roomRouter)

export default app;