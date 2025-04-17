import * as taskService from "./task.service";
import * as userService from "../users/user.service";
import * as repository from "./task.repository";
import HttpException from "../../util/http-exception.model";
import { ITask } from "./models/task.model";

jest.mock("../users/user.service");
jest.mock("./task.repository");

const mockTask: ITask = {
  _id: "task-id-1",
  name: "Test Task",
  description: "Description",
  dueDate: new Date(),
  dueTime: new Date(),
  priority: "High",
  status: "Pending",
  // Add any required Mongoose document methods with jest.fn()
  save: jest.fn(),
  $isNew: false,
  $assertPopulated: jest.fn(),
  $clone: jest.fn(),
  // ...mock other properties/methods if needed
} as unknown as ITask;

describe("Task Service", () => {
  const userId = "123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      (userService.validateUser as jest.Mock).mockResolvedValue(true);
      (repository.saveTask as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.createTask(userId, mockTask);
      expect(result).toEqual(mockTask);
      expect(userService.validateUser).toHaveBeenCalledWith([userId], true);
      expect(repository.saveTask).toHaveBeenCalledWith(userId, mockTask);
    });

    it("should throw HttpException if task creation fails", async () => {
      (userService.validateUser as jest.Mock).mockResolvedValue(true);
      (repository.saveTask as jest.Mock).mockResolvedValue(null);

      await expect(taskService.createTask(userId, mockTask)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe("getTasksByUserId", () => {
    it("should return tasks for the user", async () => {
      (userService.validateUser as jest.Mock).mockResolvedValue(true);
      (repository.retrieveTasksByUserId as jest.Mock).mockResolvedValue([
        mockTask,
      ]);

      const result = await taskService.getTasksByUserId(userId);
      expect(result).toEqual([mockTask]);
    });

    it("should throw HttpException if no tasks found", async () => {
      (userService.validateUser as jest.Mock).mockResolvedValue(true);
      (repository.retrieveTasksByUserId as jest.Mock).mockResolvedValue(null);

      await expect(taskService.getTasksByUserId(userId)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe("updateTaskDetails", () => {
    it("should update a task successfully", async () => {
      (repository.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      (repository.updateTask as jest.Mock).mockResolvedValue({
        ...mockTask,
        status: "Done",
      });

      const updatedMockTask = {
        ...mockTask,
        status: "Done",
      } as ITask;

      const result = await taskService.updateTaskDetails(
        userId,
        updatedMockTask
      );
      expect(result.status).toBe("Done");
    });

    it("should throw 202 if task not found", async () => {
      (repository.getTaskById as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.updateTaskDetails(userId, mockTask)
      ).rejects.toThrow(HttpException);
    });
  });

  describe("deleteTaskById", () => {
    it("should delete a task successfully", async () => {
      (repository.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      (repository.deleteTask as jest.Mock).mockResolvedValue({ _id: "abc123" });

      const result = await taskService.deleteTaskById(userId);
      expect(result._id).toBe("abc123");
    });

    it("should throw 202 if task not found", async () => {
      (repository.getTaskById as jest.Mock).mockResolvedValue(null);

      await expect(taskService.deleteTaskById(userId)).rejects.toThrow(
        HttpException
      );
    });
  });
});
