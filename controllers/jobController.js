import {catchAsyncError} from "../middleWares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {Job} from "../models/jobModel.js";
import jobApiFeatures from "../utils/jobApiFeatures.js";



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
    const resultPerPage = 5;
    const jobFeatures = new jobApiFeatures(Job.find(), req.query).UserJobs(req.user._id).Search().Filter().Sort().Pagination(resultPerPage);
    const jobs = await jobFeatures.query;
    const totalJobs = await Job.count({user_id:req.user._id});
    const totalPages = Math.ceil(totalJobs/resultPerPage);
    res.status(200).json({
        success:true,
        jobs,
        resultPerPage,
        totalJobs,
        totalPages
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


//get stats
export const getStats = catchAsyncError(async (req, res, next) =>{
    const interview = await Job.count({user_id:req.user._id, status:"interview"});
    const pending = await Job.count({user_id:req.user._id, status:"pending"});
    const declined = await Job.count({user_id:req.user._id, status:"declined"});

    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);
    
        return date.toLocaleString('en-US', { month: 'short' });
    }
    const monthlyData = await Job.aggregate([
        {$group: { _id : {year: { $year : "$createdAt" }, month: { $month : "$createdAt" }},
                    count: {$sum:1}
        }},
        { $sort : { _id : -1 } },
        {$limit:6}
    ]);
    let monthlyApplications =[];
    monthlyData.map((item) =>{
        const date = `${getMonthName(item._id.month)} ${item._id.year}`;
        monthlyApplications.push({date, count:item.count})
    })
    res.status(200).json({
        success:true,
        stats:{
            interview, pending, declined
        },
        monthlyApplications
    })

})