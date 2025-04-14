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
