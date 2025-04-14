import { Router, Request, Response, NextFunction } from "express";

import { createTask, deleteTaskById, getTasksByUserId, updateTaskDetails } from "./task.service";
import logger from "../../util/logger";

const router = Router();

router.post("/:id", async (req: Request, res: Response, next: NextFunction) => {
  console.log("createTask: controller hit");
  try {
    const result = await createTask(req.params.id, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    next(error);
  }
});

router.get(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await getTasksByUserId(req.params.id);
      res.status(201).json(tasks);
    } catch (error: any) {
      next(error);
    }
  }
);

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await updateTaskDetails(req.params.id, req.body);
    res.status(201).json(task);
  } catch (error: any) {
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;
    logger.info(`DELETE /task/${taskId} - Deletion request received`);
 
    try {
      const task = await deleteTaskById(taskId);
      logger.info(`Task deleted successfully: ${taskId}`);
      res.status(201).json(task);
    } catch (error: any) {
      logger.error(`Error deleting task ${taskId}: ${error.message}`);
      next(error);
    }
  }
);

export { router as taskController };
