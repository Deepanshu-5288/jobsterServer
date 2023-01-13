import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
export const isAuthenticated = catchAsyncError(async (req, res, next) =>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler(400, "Please login to update"));
    }
    const decodedData =  jwt.verify(token,  process.env.JWT_SECRET);
    req.user = await User.findById(decodedData._id);
    next();
})