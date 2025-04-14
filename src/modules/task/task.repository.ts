import { Types } from "mongoose";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { ITask, Task } from "./models/task.model";

export const saveTask = async (id: string, newTask: ITask) => {
  try {
    logger.info(`Saving new task for user ID: ${id}`);

    const task = new Task({ ...newTask, user: id });
    await task.save();

    logger.info(`Task saved successfully: ID ${task._id}`);
    return task;
  } catch (error: any) {
    logger.error(`Error saving task for user ${id}: ${error.message}`);
    throw error;
  }
};

export const getTaskById = async (id: string): Promise<ITask | null> => {
  try {
    await validateTaskById([id], true);

    const task = await Task.findById(id)
      .select("-createdAt -updatedAt -__v")
      .exec();

    return task;
  } catch (error: any) {
    logger.error(`Error fetching task ID: ${id}, error: ${error.message}`);
    throw error;
  }
};

export const retrieveTasksByUserId = async (userId: string) => {
  try {
    const tasks = await Task.find({ user: userId })
      .select("-user -createdAt -updatedAt -__v")
      .exec();

    logger.info(`Tasks fetched for user ${userId}: count = ${tasks.length}`);
    return tasks;
  } catch (error: any) {
    logger.error(`Error fetching tasks for user ${userId}: ${error.message}`);
    throw error;
  }
};

export const updateTask = async (taskId: string, updateTask: ITask) => {
  try {
    logger.info(`Updating task: ${taskId}`);

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
  } catch (error: any) {
    logger.error(`Error updating task ID: ${taskId}, error: ${error.message}`);
    throw error;
  }
};

export const deleteTask = async (id: string) => {
  try {
    logger.info(`Deleting task ID: ${id}`);

    const deletedTask = await Task.findByIdAndDelete(id).lean();

    return deletedTask;
  } catch (error: any) {
    logger.error(`Error deleting task ID: ${id}, error: ${error.message}`);
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
        logger.warn(`No valid tasks found for ID(s): ${id.join(", ")}`);
        throw new HttpException(202, {
          message: "No valid tasks found",
          result: false,
        });
      }
    }

    logger.info(`Validated task ID(s): ${data.map((u) => u._id).join(", ")}`);
    return data.map((obj) => obj._id.toString());
  } catch (error: any) {
    logger.error(
      `Validation error for task ID(s): ${id.join(", ")}, error: ${
        error.message
      }`
    );
    throw error;
  }
};
