import mongoose, { Schema } from "mongoose";

const RoomSchema = mongoose.Schema(
  {
    RoomCode:{
        type:String,
        unique:true,
        require:true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
      require: true,
    },
  },
  { timestamps: true },
);


export const Room=mongoose.model("Room",RoomSchema)