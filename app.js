import express from "express";
import { config } from "dotenv";
import { ErrorMiddleWare } from "./middleWares/Error.js";
import cookieParser from "cookie-parser";

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

import user from "./routes/userRoutes.js";
import job from "./routes/jobRoutes.js";
app.use("/api/v1", user);
app.use("/api/v1", job);


app.use(ErrorMiddleWare);
export default app;