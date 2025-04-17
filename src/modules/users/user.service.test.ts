import * as userService from "./user.service";
import * as repository from "./user.repository";
import { User } from "./models/user.model";
import HttpException from "../../util/http-exception.model";

// Mock modules
jest.mock("./user.repository");
jest.mock("./models/user.model");

const mockUser = {
  _id: "507f191e810c19729de860ea",
  email: "test@example.com",
  name: "Test User",
  password: "hashedPassword",
};

describe("User Service", () => {
  const userId = "507f191e810c19729de860ea";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateUserDetails", () => {
    it("should update a user successfully", async () => {
      (repository.updateUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.updateUserDetails(
        userId,
        mockUser as any
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw HttpException if update fails", async () => {
      (repository.updateUser as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.updateUserDetails(userId, mockUser as any)
      ).rejects.toThrow(HttpException);
    });
  });

  describe("deleteUserById", () => {
    it("should delete a user successfully", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser as any);
      (repository.deleteUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.deleteUserById(userId);
      expect(result.message).toMatch(/User successfully deleted/);
    });

    it("should throw HttpException if user not found", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(null);

      await expect(userService.deleteUserById(userId)).rejects.toThrow(
        HttpException
      );
    });

    it("should throw HttpException if delete fails", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser as any);
      (repository.deleteUser as jest.Mock).mockResolvedValue(null);

      await expect(userService.deleteUserById(userId)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe("getUserById", () => {
    it("should return user data without password", async () => {
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await userService.getUserById(userId);
      expect(result).toEqual(mockUser);
    });
  });

  describe("validateUserById", () => {
    it("should validate a correct Mongo ID and return user IDs", async () => {
      const mockLean = jest.fn().mockResolvedValue([{ _id: userId }]);
      (User.find as jest.Mock).mockReturnValue({ lean: mockLean });

      const result = await userService.validateUserById([userId], true);
      expect(result).toEqual([userId]);
    });

    it("should throw error for invalid Mongo IDs", async () => {
      const invalidId = "invalid-mongo-id";

      await expect(
        userService.validateUserById([invalidId], true)
      ).rejects.toThrow(HttpException);
    });

    it("should throw error if no users found (non-mongo path)", async () => {
      const mockLean = jest.fn().mockResolvedValue([]);
      (User.find as jest.Mock).mockReturnValue({ lean: mockLean });

      await expect(
        userService.validateUserById([userId], false)
      ).rejects.toThrow(HttpException);
    });
  });

  describe("validateUser", () => {
    it("should validate user and return ID list", async () => {
      jest.spyOn(userService, "validateUserById").mockResolvedValue([userId]);

      const result = await userService.validateUser([userId], true);
      expect(result).toEqual([userId]);
    });

    it("should throw error if no valid user found", async () => {
      jest.spyOn(userService, "validateUserById").mockResolvedValue([]);

      await expect(userService.validateUser([userId], true)).rejects.toThrow(
        HttpException
      );
    });
  });
});
