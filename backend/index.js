import connectDB from "./src/connection/connectMongo.js";
import dotenv from "dotenv";
import server from './app.js'

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`server is runner in port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed", err);
  });
