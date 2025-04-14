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
 