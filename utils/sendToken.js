export const sendToken=(res, userData, message, statusCode)=>{
    const token = userData.getJwtToken();
    let user = {...userData._doc};
    user.token = token;
    res.status(statusCode).json({
        success:true,
        message,
        user
    })
}