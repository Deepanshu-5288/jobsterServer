import {catchAsyncError} from "../middleWares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {User} from "../models/userModel.js";
import {sendToken} from "../utils/sendToken.js"
//register user
export const registerUser = catchAsyncError( async (req, res, next)=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return next(new ErrorHandler(404,"Please fill all the fields"));
    }
    let userData = await User.findOne({email});
    if(userData){
        return next(new ErrorHandler(400, "User with email already exist, please try with another email"));
    }
    userData = await User.create({name, email, password});
    userData.password = undefined;
    sendToken(res, userData, `Welcome ${userData.name}`, 201);
})

//login user
export const loginUser = catchAsyncError(async (req, res, next) =>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler(400, "Please fill all the fields"));
    }
    let userData = await User.findOne({email}).select("+password");
    if(!userData){
        return next(new ErrorHandler(404, "email or password is not correct"));
    }
    const isPasswordMatched = await userData.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler(404, "email or password is not correct"));
    }
    userData.password = undefined;
    sendToken(res, userData, `Welcome back ${userData.name}`,200);
})

//logout user
// export const logoutUser = catchAsyncError(async (req, res, next)=>{
//     res.status(200).json({
//         success:true,
//         message:"Logged out successfully"
//     })
// })

//update profile
export const updateUser = catchAsyncError(async (req, res, next)=>{
    const {name, email, lastName, location} = req.body;
    let user = await User.findByIdAndUpdate(req.user._id, {name, email, lastName, location});
    user=await User.findById(req.user._id);
    res.status(200).json({
        success:true,
        user,
        message:"profile updated successfully"
    })

})