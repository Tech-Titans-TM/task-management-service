import { Types } from "mongoose";
import { IUser, User } from "./models/user.model";
import HttpException from "../../util/http-exception.model";

export const createUser = async (
  createUser: IUser
): Promise<IUser | undefined> => {
  try {
    const newUser = new User(createUser);

    return await newUser.save();
  } catch (error: any) {
    console.error(`error creating user: ${createUser.email}, error: ${error}`);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const user = await User.findOne({ email });

    return user;
  } catch (error: any) {
    console.error(`error when retrieving user: ${email}, error: ${error}`);
    throw error;
  }
};

export const updateUser = async (id: string, updateUser: IUser) => {
  try {
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
      throw new Error(`User with ID ${id} not found.`);
    }

    return updatedUser;
  } catch (error) {
    console.error(`Error updating user with ID: ${id}, error: ${error}`);
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

export const deleteUser = async (id: string) => {
  try {
    await validateUserById([id], true);
    const deletedUser = await User.findByIdAndDelete(id).lean();
    return deletedUser;
  } catch (error) {
    console.error(
      `Error occurred when deleting user ID: ${id}, error: ${error}`
    );
    throw error;
  }
};
