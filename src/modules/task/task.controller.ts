import { Router, Request, Response, NextFunction } from "express";

import {
  createTask,
  deleteTaskById,
  getTasksByUserId,
  updateTaskDetails,
} from "./task.service";
import logger from "../../util/logger";

const router = Router();

router.post(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    logger.info(`POST /task/user/${userId} - Create task request received`);

    try {
      const result = await createTask(userId, req.body);

      res.status(201).json({ result });
    } catch (error: any) {
      logger.error(`Error creating task for user ${userId}: ${error.message}`);
      next(error);
    }
  }
);

router.get(
  "/user/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    logger.info(`GET /task/user/${userId} - Fetch tasks request received`);

    try {
      const tasks = await getTasksByUserId(userId);

      res.status(201).json(tasks);
    } catch (error: any) {
      logger.error(`Error fetching tasks for user ${userId}: ${error.message}`);
      next(error);
    }
  }
);

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const taskId = req.params.id;
  logger.info(`PUT /task/${taskId} - Update request received`);

  try {
    const task = await updateTaskDetails(taskId, req.body);

    res.status(201).json(task);
  } catch (error: any) {
    logger.error(`Error updating task ${taskId}: ${error.message}`);
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

      res.status(201).json(task);
    } catch (error: any) {
      logger.error(`Error deleting task ${taskId}: ${error.message}`);
      next(error);
    }
  }
);

export { router as taskController };
