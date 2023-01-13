import {catchAsyncError} from "../middleWares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {Job} from "../models/jobModel.js";



//add job
export const addJob = catchAsyncError(async (req, res, next) =>{
    const {company, position, jobLocation, jobType, status} = req.body;
    if(!company || !position || !jobLocation || !jobType || !status){
        return next(new ErrorHandler(404, "Please enter all fields"));
    }
    const user_id = req.user._id
    const job = await Job.create({company, position, jobLocation, jobType, status, user_id});

    res.status(201).json({
        success:true,
        job,
        message:"Job created successfully"
    })
})

//get all jobs
export const getJobs = catchAsyncError(async (req, res, next)=>{
    const jobs = await Job.find({user_id:req.user._id});
    res.status(200).json({
        success:true,
        jobs
    })
})

//edit job
export const editJob = catchAsyncError(async (req, res, next)=>{
    const {position, company, jobLocation, jobType, status} = req.body;
    if(!company || !position || !jobLocation || !jobType || !status){
        return next(new ErrorHandler(400, "Please enter all fields"));
    }
    let job = await Job.findOneAndUpdate ({_id:req.params.id, user_id:req.user._id}, {position, company, jobLocation, jobType, status}, {new:true} );
    if(!job){
        return next(new ErrorHandler(400, "you are not authorized to update this job"));
    }
    res.status(200).json({
        success:true,
        message:"Job updated successfully",
        job
    })
})

//delete job
export const deleteJob = catchAsyncError(async (req, res, next)=>{
    const job = await Job.findOneAndDelete({_id:req.params.id, user_id:req.user._id});
    if(!job){
        return next(new ErrorHandler(404, "You are not authorized to delete this job"))
    }
    res.status(200).json({
        success:true,
        message:"Job deleted successfully"
    })
})