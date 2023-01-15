export const sendToken=(res, user, message, statusCode)=>{
    const token = user.getJwtToken();
    const options = {
        httpOnly:true,
        sameSite:"none",
        expires:new Date(Date.now() + 15*60*60*1000),
        secure
    }
    res.status(statusCode).cookie("token", token, options).json({
        success:true,
        message,
        user
    })
}