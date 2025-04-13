import { Router, Request, Response, NextFunction } from "express";
import { updateUserDetails } from "./user.service";
 
const router = Router();
 
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  console.log("updateUserDetails: controller hit");
  try {
    const user = await updateUserDetails(req.params.id, req.body);
    res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
});
 
export { router as userController };