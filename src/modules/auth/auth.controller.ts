import { Router, Request, Response, NextFunction } from "express";

import { signup } from "./auth.service";

const router = Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await signup({ ...req.body.user });
      res.status(201).json(user);
    } catch (error: any) {
      next(error);
    }
  }
);

export { router as authController };
