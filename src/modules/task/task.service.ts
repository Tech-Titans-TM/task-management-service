import HttpException from "../../util/http-exception.model";
import { validateUser } from "../users/user.service";
import { ITask } from "./models/task.model";
import { saveTask } from "./task.repository";

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
