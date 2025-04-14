import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";
import { validateUser } from "../users/user.service";
import { ITask } from "./models/task.model";
import { deleteTask, getTaskById, retrieveTasksByUserId, saveTask, updateTask } from "./task.repository";

export const createTask = async (id: string, newTask: ITask) => {
  try {
    const isUUID: boolean = true;
    await validateUser([id], isUUID);

    const task = await saveTask(id, newTask);
    if (!task) {
      throw new HttpException(500, {
        message: `Error in creating task: ${JSON.stringify(newTask)}`,
        result: false,
      });
    }

    return task;
  } catch (error) {
    throw error;
  }
};

export const getTasksByUserId = async (id: string) => {
  try {
    const isUUID: boolean = true;
    await validateUser([id], isUUID);
 
    const data = await retrieveTasksByUserId(id);
    if (!data) {
      throw new HttpException(500, {
        message: `Error occurred when retrieving tasks by userId: ${id}`,
        result: false,
      });
    }
 
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateTaskDetails = async (id: string, updateTaskData: ITask) => {
  try {
    const updatedTask = await updateTask(id, updateTaskData);
    if (!updatedTask) {
      throw new HttpException(500, {
        message: `Error updating task with ID: ${id}`,
        result: false,
      });
    }
    return updatedTask;
  } catch (error: any) {
    throw error;
  }
};

export const deleteTaskById = async (id: string) => {
  try {
    logger.info(`Attempting to delete task: ${id}`);
 
    const task = await getTaskById(id);
    if (task === null) {
      logger.warn(`Task not found for deletion: ${id}`);
      throw new HttpException(202, {
        message: `Task ID : ${id} does not exist`,
      });
    }
 
    const deletedTask = await deleteTask(id);
    if (!deletedTask) {
      logger.error(`Failed to delete task with ID: ${id}`);
      throw new HttpException(500, {
        message: `Error in deleting task ID: ${id}`,
        result: false,
      });
    }
 
    logger.info(`Task deleted: ID: ${deletedTask._id}`);
 
    return deletedTask;
  } catch (error: any) {
    logger.error(`Delete task error (ID: ${id}): ${error.message}`);
    throw error;
  }
};
