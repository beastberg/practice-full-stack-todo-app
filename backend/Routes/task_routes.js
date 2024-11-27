import express from "express"
import { getTask, postTask, protect ,deleteTask} from "../Controllers/task_controller.js";
const router =express.Router();

router.get("/getTask",protect,getTask)
router.post("/postTask",protect,postTask)
router.delete("/deleteTask/:id",protect,deleteTask)

export default router;