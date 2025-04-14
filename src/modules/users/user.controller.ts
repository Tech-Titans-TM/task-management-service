import { Router, Request, Response, NextFunction } from "express";
import { deleteUserById, updateUserDetails } from "./user.service";
import logger from "../../util/logger";

const router = Router();

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id;
  logger.info(`PUT /users/${userId} - Update request received`);

  try {
    const user = await updateUserDetails(userId, req.body);
    logger.info(`User updated successfully: ${userId}`);
    res.status(201).json(user);
  } catch (error: any) {
    logger.error(`Error updating user ${userId}: ${error.message}`);
    next(error);
  }
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    logger.info(`DELETE /users/${userId} - Deletion request received`);

    try {
      const user = await deleteUserById(userId);
      logger.info(`User deleted successfully: ${userId}`);
      res.status(201).json({ ...user });
    } catch (error: any) {
      logger.error(`Error deleting user ${userId}: ${error.message}`);
      next(error);
    }
  }
);

export { router as userController };
