import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./Routes/auth_routes.js";
import taskRoute from "./Routes/task_routes.js";

dotenv.config();
const app =express();//create a instance of express app
const port = process.env.PORT


const connectDb=async()=>{
    //always use try and catch block
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("connected to db");
    } catch (err) {
        console.log("error in connecting to db")
    }
}
connectDb();

//middleware
app.use(cors())
app.use(express.json())
app.use("/auth",authRoute);
app.use("/task",taskRoute);


app.listen(port ||4000,()=>{
    console.log(`port is running on ${port}`)
})





