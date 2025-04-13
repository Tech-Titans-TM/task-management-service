import dotenv from "dotenv";

import { createUser } from "../users/user.repository";
import { IUser, User } from "../users/models/user.model";
import { AuthResult } from "./interface/auth.interface";
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
