import { IUser, User } from "./models/user.model";

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
