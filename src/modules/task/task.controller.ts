import { Router, Request, Response, NextFunction } from "express";

import { createTask, getTasksByUserId, updateTaskDetails } from "./task.service";

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

export { router as taskController };
