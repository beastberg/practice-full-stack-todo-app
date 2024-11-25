import express from "express";
import { postTask,getTask,protect} from "../Controllers/task_controller.js";
const router = express.Router();

router.post("/postTask",protect,postTask);
router.get("/getTask",protect,getTask);

export default router;