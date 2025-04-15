import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectMongoDB from "./config/db";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

connectMongoDB();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://18.142.227.149:5173/', /
  credentials: true               
}));

app.use(routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
