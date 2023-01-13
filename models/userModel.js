import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const schema =  mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your name"]
    },
    lastName:{
        type:String,
        required:[true, "Please enter your last name"],
        default:"Last name"
    },
    email:{
        type:String,
        required:[true, "please enter your email"],
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:[true, "please enter your password"],
        minLength:[8, "Password cannot be less then 8 characters"],
        select:false
    },
    location:{
        type:String,
        required:[true, "Please enter your location"],
        default:"location"
    }
})

schema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

schema.methods.getJwtToken =  function() {
    return jwt.sign({_id:this._id}, process.env.JWT_SECRET, {
        expiresIn:"15d"
    })
}

schema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", schema);