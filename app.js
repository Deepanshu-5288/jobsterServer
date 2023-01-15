import express from "express";
import { config } from "dotenv";
import { ErrorMiddleWare } from "./middleWares/Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config({
    path:"./config/config.env"
})
const app =express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended:true
    })
)
app.use(cookieParser());
app.use(cors({
    origin:process.env.FRONTEND_URI,
    credentials:true,
    methods:["GET", "POST", "PUT", "DELETE", "PATCH"]
}))
import user from "./routes/userRoutes.js";
import job from "./routes/jobRoutes.js";
app.use("/api/v1", user);
app.use("/api/v1", job);

app.get("/", (req,res) =>{
    res.send(`Site is working, Click <a href=${process.env.FRONTEND_URI}>here</a> to visit frontend`);
})
app.use(ErrorMiddleWare);
export default app;