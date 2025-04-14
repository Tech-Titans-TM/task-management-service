import { Types } from "mongoose";
import { IUser, User } from "./models/user.model";
import HttpException from "../../util/http-exception.model";
import logger from "../../util/logger";

export const createUser = async (
  createUser: IUser
): Promise<IUser | undefined> => {
  try {
    const newUser = new User(createUser);
    logger.info(`Creating user: ${createUser.email}`);
    return await newUser.save();
  } catch (error: any) {
    logger.error(
      `Error creating user: ${createUser.email}, error: ${error.message}`
    );
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    logger.info(`Retrieving user by email: ${email}`);
    const user = await User.findOne({ email });
    return user;
  } catch (error: any) {
    logger.error(`Error retrieving user: ${email}, error: ${error.message}`);
    throw error;
  }
};

export const updateUser = async (id: string, updateUser: IUser) => {
  try {
    logger.info(`Updating user: ${id}`);
    await validateUserById([id], true);

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: updateUser },
      { new: true }
    )
      .lean()
      .select("-password -createdAt -updatedAt -__v")
      .exec();

    if (!updatedUser) {
      logger.warn(`User with ID ${id} not found for update`);
      throw new Error(`User with ID ${id} not found.`);
    }

    logger.info(`User updated successfully: ${id}`);
    return updatedUser;
  } catch (error) {
    logger.error(`Error updating user ID: ${id}, error: ${error}`);
    throw error;
  }
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
        logger.warn(`No users found for ID(s): ${id.join(", ")}`);
        throw new HttpException(202, {
          message: "No valid courses found",
          result: false,
        });
      }
    }

    logger.info(`User ID(s) validated: ${users.map((u) => u._id).join(", ")}`);
    return users.map((user) => user._id.toString());
  } catch (error) {
    logger.error(
      `Validation error for user ID(s): ${id.join(
        ", "
      )}, error: ${JSON.stringify(error)}`
    );
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    logger.info(`Deleting user ID: ${id}`);
    await validateUserById([id], true);

    const deletedUser = await User.findByIdAndDelete(id).lean();

    return deletedUser;
  } catch (error) {
    logger.error(`Error deleting user ID: ${id}, error: ${error}`);
    throw error;
  }
};
