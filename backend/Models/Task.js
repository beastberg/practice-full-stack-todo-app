import mongoose, { mongo } from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    msg:{
        type:String,
        required:true,
    },
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true} //this is the error 
})

const Task = mongoose.model("Task",taskSchema);
export default Task;