import Task from "../Models/Task.js";
import jwt from "jsonwebtoken"

export const postTask = async(req,res)=>{
    const {title,msg} = req.body;
    try {
        const task = new Task({title,msg,userId:req.user.id});
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        
    }
}

// export const getTask = async(req,res)=>{
//     const task = await Task.find({userId:req.user.id});
//     res.json(task);
// }

export const getTask = async (req, res) => {
    try {
      //console.log("User ID from req.user:", req.user.id); // Debug
      const task = await Task.find({userId: req.user.id });
      res.send({task});
    } catch (error) {
      //console.error("Error fetching tasks:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
};

  
export const protect = (req,res,next)=>{
    const token =req.headers["x-auth-token"];
    if(!token) return res.status(401).json({message:"Not authorized"});

    try {
        const decoded = jwt.verify(token,process.env.JWT);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({message:"invalid token",error:error.message})
    }

}

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const delTask = await Task.findByIdAndDelete(id);
        if (!delTask) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.status(200).json({ message: "TASK DELETED SUCCESSFULLY", id })
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
}