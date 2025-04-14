import HttpException from "../../util/http-exception.model";
import { validateUser } from "../users/user.service";
import { ITask } from "./models/task.model";
import { retrieveTasksByUserId, saveTask, updateTask } from "./task.repository";

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
