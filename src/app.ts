import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectMongoDB from "./config/db";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

connectMongoDB();

const app = express();

app.use(cors());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
