import mongoose, { Schema } from "mongoose";
import { Room } from "./Room.model";

const ParticipantSchema=mongoose.Schema({
    nickname:{
        type:String,
        require:true,
    },
    RoomCode:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        require:true,
    },
    status:{
        type:Boolean,
        default:false,
    }
},
{timestamps:true}
)

export const Participant=mongoose.model("Participant",ParticipantSchema)