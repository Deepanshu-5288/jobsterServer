import mongoose from "mongoose";


const schema = new mongoose.Schema({
    position:{
        type:String,
        required:[true, "please enter the position"]
    },
    company:{
        type:String,
        required:[true, "please enter the position"]
    },
    jobLocation:{
        type:String,
        required:[true, "please enter the position"]
    },
    status:{
        type:String,
        required:[true, "please enter the position"]
    },
    jobType:{
        type:String,
        required:[true, "please enter the position"]
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})


export const Job = mongoose.model("Job", schema);