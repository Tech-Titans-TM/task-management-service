import { Router, Request, Response, NextFunction } from "express";

import { createTask } from "./task.service";

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

export { router as taskController };
