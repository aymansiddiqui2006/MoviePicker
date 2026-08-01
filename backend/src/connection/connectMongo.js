import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const res =await mongoose.connect(`${process.env.DATA_BASE_URL}`);
    console.log(`MongoDB connected !! DB host ${res.connection.host}`);
  } catch (error) {
    console.log("Could not connect to MongoDB: ", error);
    process.exit(1);
  }
};

export default connectDB;
