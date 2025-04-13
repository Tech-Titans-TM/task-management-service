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

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  console.log(`getOneUserByEmail: ${email}`);
  try {
    const user = await User.findOne({ email });
 
    return user;
  } catch (error: any) {
    console.error(`error when retrieving user: ${email}, error: ${error}`);
    throw error;
  }
};
