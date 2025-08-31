import httpStatus from "http-status";
import { ApiError, paginationHelper, prismaClient } from "../../../utils";
import { Prisma, User } from "@prisma/client";
import { IPaginationOption } from "../../../interfaces/pagination";
import { UserFilterOption } from "./users.interface";

const updateUser = async (
  id: string,
  payload: User
): Promise<Omit<User, "password"> | null> => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  if (!userExist) throw new ApiError(httpStatus.NOT_FOUND, "User not exists");

  const user: Partial<User> = await prismaClient.user.update({
    where: {
      id,
    },
    data: payload,
  });
  delete user.password;
  return user as Omit<User, "password">;
};

const deleteUser = async (id: string): Promise<User | null> => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  if (!userExist) throw new ApiError(httpStatus.NOT_FOUND, "User not exists");

  await prismaClient.user.update({
    where: {
      id,
    },
    data: { isDeleted: true },
  });

  return userExist;
};

const findOneUser = async (
  id: string
): Promise<Omit<User, "password"> | null> => {
  const userExist: Partial<User> | null = await prismaClient.user.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!userExist) throw new ApiError(httpStatus.NOT_FOUND, "User not exists");

  delete userExist.password;
  return userExist as Omit<User, "password">;
};

const findAllUsers = async (
  filterOptions: UserFilterOption,
  paginationOptions: IPaginationOption
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper(paginationOptions);

  const andCondition = [];

  const { search, ...options } = filterOptions;
  if (Object.keys(options).length) {
    andCondition.push({
      AND: Object.entries(options).map(([field, value]) => {
        return {
          [field]: value,
        };
      }),
    });
  }

  if (search)
    andCondition.push({
      OR: ["name", "email"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const users = await prismaClient.user.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const count = await prismaClient.user.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      size: limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: users,
  };
};

export const UserService = {
  updateUser,
  deleteUser,
  findOneUser,
  findAllUsers,
};
