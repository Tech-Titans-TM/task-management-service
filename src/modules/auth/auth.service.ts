import dotenv from "dotenv";

import { createUser, getUserByEmail } from "../users/user.repository";
import { IUser, User } from "../users/models/user.model";
import { AuthResult, LoginInput } from "./interface/auth.interface";
import HttpException from "../../util/http-exception.model";
import { encrypt } from "./encrypt";

dotenv.config();

export const signup = async (registerUser: IUser): Promise<AuthResult> => {
  try {
    const newUser = new User({
      ...registerUser,
    });
    await createUser(newUser);

    const token = encrypt.generateToken({
      userId: newUser._id,
      email: newUser.email,
    });

    return {
      message: "Signup successful",
      result: true,
      data: {
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
        accessToken: token,
      },
    };
  } catch (error: any) {
    if (error.code === 11000) {
      throw new HttpException(409, {
        message: "Email already exist",
        result: false,
        data: {
          accessToken: null,
        },
        error: { errmsg: error.errorResponse.errmsg },
      });
    } else {
      throw new HttpException(500, {
        message: "Server error",
        error: { error },
      });
    }
  }
};


export const login = async (loginInput: LoginInput): Promise<AuthResult> => {
  try {
    const user: any = await getUserByEmail(loginInput.email);
    if (!user) {
      throw new HttpException(401, {
        message: "Invalid email or password",
        result: false,
      });
    }
 
    const isMatch = await encrypt.verifyPassword(
      user.password,
      loginInput.password
    );
 
    if (!isMatch) {
      throw new HttpException(401, {
        message: "Invalid email or password",
        result: false,
      });
    }
 
    const token = encrypt.generateToken({
      userId: user._id,
      email: user.email,
    });
 
    return {
      message: "Login successful",
      result: true,
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        accessToken: token,
      },
    };
  } catch (error: any) {
    throw error;
  }
};