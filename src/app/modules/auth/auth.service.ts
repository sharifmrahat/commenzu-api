import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { ApiError, JwtHelpers, prismaClient } from "../../../utils";
import config from "../../../config";
import { User } from "@prisma/client";

const login = async (payload: { email: string; password: string }) => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userExist)
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");

  if (
    userExist?.password &&
    !(await bcrypt.compare(payload.password, userExist?.password))
  )
    throw new ApiError(httpStatus.BAD_REQUEST, "Wrong credentials!");

  const accessToken = JwtHelpers.generateToken({
    userId: userExist?.id,
    role: userExist?.role,
  });

  return {
    accessToken,
    user: userExist,
  };
};

const signUp = async (payload: User) => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (userExist)
    throw new ApiError(
      httpStatus.CONFLICT,
      "User already exist using same email!"
    );

  const password = payload.password;

  payload.password = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

  const createdUser = await prismaClient.user.create({
    data: payload,
  });

  if (!createdUser)
    throw new ApiError(httpStatus.EXPECTATION_FAILED, "Failed to create user");

  const user: Partial<User | null> = await prismaClient.user.findFirst({
    where: {
      id: createdUser.id,
    },
  });

  delete user?.password;

  return user;
};

export const AuthService = {
  signUp,
  login,
};
