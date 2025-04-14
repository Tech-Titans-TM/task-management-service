import mongoose, { Schema, Document } from "mongoose";

const TaskSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true, unique: true },
    dueTime: { type: Date, required: true, unique: true },
    priority: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export interface ITask extends Document {
  name: string;
  description: string;
  dueDate: Date;
  dueTime: Date;
  priority: string;
  status: string;
}

export const Task = mongoose.model<ITask>("Task", TaskSchema);
