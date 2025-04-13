import { Types } from "mongoose";
import HttpException from "../../util/http-exception.model";
import { IUser, User } from "./models/user.model";
import { deleteUser, updateUser } from "./user.repository";

export const updateUserDetails = async (id: string, updateUserData: IUser) => {
  try {
    const updatedUser = await updateUser(id, updateUserData);
    if (!updatedUser) {
      throw new HttpException(500, {
        message: `Error updating user with ID: ${id}`,
        result: false,
      });
    }
    return updatedUser;
  } catch (error: any) {
    throw error;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const user = await getUserById(id);

    if (user === null) {
      throw new HttpException(202, {
        message: `User ID : ${id} does not exist`,
      });
    }

    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      throw new HttpException(500, {
        message: `Error in deleting user ID: ${id}`,
        result: false,
      });
    }

    return {
      message: `User successfully deleted: ID: ${deletedUser._id}, email: ${deletedUser.email}`,
    };
  } catch (error: any) {
    throw error;
  }
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    await validateUserById([id], true);

    const user = await User.findById(id)
      .select("-password -createdAt -updatedAt -__v")
      .exec();
    return user;
  } catch (error) {
    console.error(
      `error in retrieving userById _id: ${id},  error: ${JSON.stringify(
        error
      )}`
    );
    throw error;
  }
};

export const validateUserById = async (
  id: string[],
  isMongoId: boolean
): Promise<string[]> => {
  try {
    let users;

    if (isMongoId) {
      const invalidIds = id.filter((id) => !Types.ObjectId.isValid(id));

      if (invalidIds.length > 0) {
        throw new HttpException(202, {
          message: `Invalid Mongo ID(s): ${invalidIds.join(", ")}`,
          result: false,
        });
      }

      users = await User.find({ _id: { $in: id } }, { _id: 1 }).lean();
    } else {
      users = await User.find({ _id: { $in: id } }, { _id: 1 }).lean();

      if (!users.length) {
        throw new HttpException(202, {
          message: "No valid courses found",
          result: false,
        });
      }
    }

    return users.map((user) => user._id.toString());
  } catch (error) {
    console.error(
      `error in validating userById _id: ${id},  error: ${JSON.stringify(
        error
      )}`
    );
    throw error;
  }
};
