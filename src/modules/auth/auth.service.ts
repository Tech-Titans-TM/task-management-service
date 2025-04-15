import dotenv from "dotenv";

import { createUser, getUserByEmail } from "../users/user.repository";
import { IUser, User } from "../users/models/user.model";
import { AuthResult, LoginInput } from "./interface/auth.interface";
import HttpException from "../../util/http-exception.model";
import { encrypt } from "./encrypt";
import logger from "../../util/logger";

dotenv.config();

export const signup = async (registerUser: IUser): Promise<AuthResult> => {
  try {
    logger.info(`Signup attempt: ${registerUser?.email || "unknown email"}`);

    const newUser = new User({
      ...registerUser,
    });
    await createUser(newUser);

    logger.info(`User created: ${newUser.firstName || "unknown name"}`);

    const token = encrypt.generateToken({
      userId: newUser._id,
      email: newUser.email,
    });

    logger.info(`Token generated for signup: ${newUser.email}`);

    return {
      message: "Signup successful",
      result: true,
      data: {
        user: {
          userId: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
        accessToken: token,
      },
    };
  } catch (error: any) {
    logger.error(
      `Signup error for email ${registerUser?.email || "unknown"}: ${
        error.message
      }`
    );

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
    logger.info(`Login attempt: ${loginInput.email}`);

    const user: any = await getUserByEmail(loginInput.email);
    if (!user) {
      logger.warn(`Login failed: user not found for email ${loginInput.email}`);
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
      logger.warn(`Login failed: password mismatch for ${loginInput.email}`);
      throw new HttpException(401, {
        message: "Invalid email or password",
        result: false,
      });
    }

    const token = encrypt.generateToken({
      userId: user._id,
      email: user.email,
    });

    logger.info(`Login successful: ${user.email}`);

    return {
      message: "Login successful",
      result: true,
      data: {
        user: {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        accessToken: token,
      },
    };
  } catch (error: any) {
    logger.error(`Login error for email ${loginInput.email}: ${error.message}`);
    throw error;
  }
};
