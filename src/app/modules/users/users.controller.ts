import { catchAsync, pick, responseData } from "../../../utils";
import { UserService } from "./users.service";

const insertUser = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await UserService.insertUser(user);

  return responseData({ message: "User added successfully", result }, res);
});

const updateUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await UserService.updateUser(id, data);

  return responseData({ message: "User updated successfully", result }, res);
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserService.deleteUser(id);

  return responseData({ message: "User deleted  successfully", result }, res);
});

const findOneUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserService.findOneUser(id);
  return responseData({ message: "User fetched successfully", result }, res);
});

const getProfile = catchAsync(async (req, res) => {
  const id = req.user?.userId as string;

  const result = await UserService.findOneUser(id);
  return responseData({ message: "Profile fetched successfully", result }, res);
});

const updateProfile = catchAsync(async (req, res) => {
  const id = req.user?.userId as string;
  const data = req.body;

  const result = await UserService.updateUser(id, data);

  return responseData({ message: "Profile updated successfully", result }, res);
});

const findAllUsers = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "size",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, ["search", "role", "isActive", "isBanned"]);

  const result = await UserService.findAllUsers(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Users retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

export const UserController = {
  insertUser,
  updateUser,
  deleteUser,
  findOneUser,
  findAllUsers,
  getProfile,
  updateProfile,
};
