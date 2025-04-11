import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

export { app };
