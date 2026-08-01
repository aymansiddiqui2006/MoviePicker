import mongoose, { modelNames, Schema } from "mongoose";

const MovieSchama=mongoose.Schema({
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
    },
    tmdbId:{
        type:String
    },
    title:{
        type:String
    },
    votes:{
        type:Number,
        default:0,
    },
    poster:{
        type:String
    },
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Participant"
    }
})

movieSchema.index(
{
    room:1,
    tmdbId:1
},
{
    unique:true
});

export const Movie=mongoose.model("Movie",movieSchema);