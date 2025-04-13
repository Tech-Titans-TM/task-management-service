import HttpException from "../../util/http-exception.model";
import { IUser } from "./models/user.model";
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

function getUserById(id: string) {
  throw new Error("Function not implemented.");
}
 