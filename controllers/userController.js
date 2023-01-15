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
    let user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler(400, "User with email already exist, please try with another email"));
    }
    user = await User.create({name, email, password});
    user.password = undefined;
    sendToken(res, user, `Welcome ${user.name}`, 201);
})

//login user
export const loginUser = catchAsyncError(async (req, res, next) =>{
    const {email, password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler(400, "Please fill all the fields"));
    }
    let user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler(404, "email or password is not correct"));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler(404, "email or password is not correct"));
    }
    user.password = undefined;
    sendToken(res, user, `Welcome back ${user.name}`,200);
})

//logout user
export const logoutUser = catchAsyncError(async (req, res, next)=>{
    res.status(200).cookie("token", null, {
        httpOnly:true,
        sameSite:"none",
        expires: new Date(Date.now()),
        secure:true
    }).json({
        success:true,
        message:"Logged out successfully"
    })
})

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