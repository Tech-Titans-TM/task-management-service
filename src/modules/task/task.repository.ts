import { Types } from "mongoose";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { ITask, Task } from "./models/task.model";

export const saveTask = async (id: string, newTask: ITask) => {
  try {
    const task = new Task({ ...newTask, user: id });

    await task.save();

    return task;
  } catch (error) {
    console.error(
      `error occurred when saving task to mongo, task: ${JSON.stringify(
        newTask
      )}, error: ${error}`
    );
    throw error;
  }
};

export const retrieveTasksByUserId = async (userId: string) => {
  try {
    const tasks = await Task.find({ user: userId })
      .select("-user -createdAt -updatedAt -__v")
      .exec();
    return tasks;
  } catch (error) {
    console.error(`Error fetching tasks for user ${userId}:`, error);
    throw error;
  }
};

export const updateTask = async (taskId: string, updateTask: ITask) => {
  try {
    logger.info(`Updating task: ${taskId}`);
    await validateTaskById([taskId], true);
 
    const updatedUser = await Task.findOneAndUpdate(
      { _id: taskId },
      { $set: updateTask },
      { new: true }
    )
      .lean()
      .select("-password -createdAt -updatedAt -__v")
      .exec();
 
    if (!updatedUser) {
      logger.warn(`Task with ID ${taskId} not found for update`);
      throw new Error(`Task with ID ${taskId} not found.`);
    }
 
    logger.info(`Task updated successfully: ${taskId}`);
    return updatedUser;
  } catch (error) {
    logger.error(`Error updating task ID: ${taskId}, error: ${error}`);
    throw error;
  }
};

export const validateTaskById = async (
  id: string[],
  isMongoId: boolean
): Promise<string[]> => {
  try {
    logger.info(`Validating task ID(s): ${id.join(", ")}`);
 
    let data;
 
    if (isMongoId) {
      const invalidIds = id.filter((id) => !Types.ObjectId.isValid(id));
 
      if (invalidIds.length > 0) {
        logger.warn(`Invalid Mongo ID(s): ${invalidIds.join(", ")}`);
        throw new HttpException(202, {
          message: `Invalid Mongo ID(s): ${invalidIds.join(", ")}`,
          result: false,
        });
      }
 
      data = await Task.find({ _id: { $in: id } }, { _id: 1 }).lean();
    } else {
      data = await Task.find({ _id: { $in: id } }, { _id: 1 }).lean();
 
      if (!data.length) {
        logger.warn(`No task found for ID(s): ${id.join(", ")}`);
        throw new HttpException(202, {
          message: "No valid tasks found",
          result: false,
        });
      }
    }
 
    logger.info(`Task ID(s) validated: ${data.map((u) => u._id).join(", ")}`);
    return data.map((obj) => obj._id.toString());
  } catch (error) {
    logger.error(
      `Validation error for task ID(s): ${id.join(
        ", "
      )}, error: ${JSON.stringify(error)}`
    );
    throw error;
  }
};
 