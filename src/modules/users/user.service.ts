import { Types } from "mongoose";
import HttpException from "../../util/http-exception.model";
import { IUser, User } from "./models/user.model";
import { deleteUser, updateUser } from "./user.repository";
import logger from "../../util/logger";

export const updateUserDetails = async (id: string, updateUserData: IUser) => {
  try {
    logger.info(`Attempting to update user: ${id}`);

    const updatedUser = await updateUser(id, updateUserData);
    if (!updatedUser) {
      logger.error(`Failed to update user with ID: ${id}`);
      throw new HttpException(500, {
        message: `Error updating user with ID: ${id}`,
        result: false,
      });
    }

    logger.info(`User updated successfully: ${id}`);
    return updatedUser;
  } catch (error: any) {
    logger.error(`Update user error (ID: ${id}): ${error.message}`);
    throw error;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    logger.info(`Attempting to delete user: ${id}`);

    const user = await getUserById(id);
    if (user === null) {
      logger.warn(`User not found for deletion: ${id}`);
      throw new HttpException(202, {
        message: `User ID : ${id} does not exist`,
      });
    }

    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      logger.error(`Failed to delete user with ID: ${id}`);
      throw new HttpException(500, {
        message: `Error in deleting user ID: ${id}`,
        result: false,
      });
    }

    logger.info(
      `User deleted: ID: ${deletedUser._id}, Email: ${deletedUser.email}`
    );

    return {
      message: `User successfully deleted: ID: ${deletedUser._id}, email: ${deletedUser.email}`,
    };
  } catch (error: any) {
    logger.error(`Delete user error (ID: ${id}): ${error.message}`);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    logger.info(`Fetching user by ID: ${id}`);

    await validateUserById([id], true);

    const user = await User.findById(id)
      .select("-password -createdAt -updatedAt -__v")
      .exec();

    return user;
  } catch (error) {
    logger.error(`Error in getUserById (ID: ${id}): ${JSON.stringify(error)}`);
    throw error;
  }
};

export const validateUser = async (
  id: string[],
  isMongo: boolean
): Promise<string[] | any> => {
  const validatedData = await validateUserById(id, isMongo);

  if (!validatedData || validatedData.length === 0) {
    logger.warn(`User ID not found: ${id}`);
    throw new HttpException(202, {
      message: `UserId not found - ID: ${id}`,
    });
  }

  return validatedData;
};

export const validateUserById = async (
  id: string[],
  isMongoId: boolean
): Promise<string[]> => {
  try {
    logger.info(`Validating user ID(s): ${id.join(", ")}`);

    let users;

    if (isMongoId) {
      const invalidIds = id.filter((id) => !Types.ObjectId.isValid(id));

      if (invalidIds.length > 0) {
        logger.warn(`Invalid Mongo ID(s): ${invalidIds.join(", ")}`);
        throw new HttpException(202, {
          message: `Invalid Mongo ID(s): ${invalidIds.join(", ")}`,
          result: false,
        });
      }

      users = await User.find({ _id: { $in: id } }, { _id: 1 }).lean();
    } else {
      users = await User.find({ _id: { $in: id } }, { _id: 1 }).lean();

      if (!users.length) {
        logger.warn("No users found by provided ID(s)");
        throw new HttpException(202, {
          message: "No valid courses found",
          result: false,
        });
      }
    }

    logger.info(
      `Validated user ID(s): ${users.map((user) => user._id).join(", ")}`
    );
    return users.map((user) => user._id.toString());
  } catch (error) {
    logger.error(
      `Validation error for ID(s): ${id.join(", ")} - ${JSON.stringify(error)}`
    );
    throw error;
  }
};
