import mongoose, { Schema, Document } from "mongoose";

const TaskSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    description: { type: String },
    dueDate: { type: Date },
    dueTime: { type: Date },
    priority: { type: String },
    status: { type: String },
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
