import { Router, Request, Response, NextFunction } from "express";
import { login, signup } from "./auth.service";
import logger from "../../util/logger";

const router = Router();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /signup called");

    try {
      const user = await signup({ ...req.body.user });
      res.status(201).json(user);
    } catch (error: any) {
      logger.error(`Signup error: ${error.message}`);
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("POST /login called");

    try {
      const result = await login(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`Login error: ${error.message}`);
      next(error);
    }
  }
);

export { router as authController };
