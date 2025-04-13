import HttpException from "../../util/http-exception.model";
import { IUser } from "./models/user.model";
import { updateUser } from "./user.repository";
 
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
 