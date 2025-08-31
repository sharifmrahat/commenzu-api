import { UserRole } from "@prisma/client";
import { catchAsync, generateSlugId, pick, responseData } from "../../../utils";
import { PostService } from "./posts.service";

const insertPost = catchAsync(async (req, res) => {
  const post = req.body;
  const userRole = req.user?.role as UserRole;

  const data = {
    ...post,
    authorId: req.user?.userId,
    slug: generateSlugId("POST"),
  };

  const result = await PostService.insertPost(data, userRole);

  return responseData({ message: "Post created successfully", result }, res);
});

const updateApprovalStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const status = req.body?.approvalStatus;

  const result = await PostService.updateApprovalStatus(id, status);

  return responseData(
    { message: "Post approval status updated successfully", result },
    res
  );
});

const updatePostStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const status = req.body?.approvalStatus;
  const userId = req.user?.userId as string;

  const result = await PostService.updatePostStatus(id, status, userId);

  return responseData(
    { message: "Post status updated successfully", result },
    res
  );
});

const deletePost = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await PostService.deletePost(id);

  return responseData({ message: "Post deleted  successfully", result }, res);
});

const findOnePost = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await PostService.findOnePost(id);
  return responseData({ message: "Post fetched successfully", result }, res);
});

const findAllPublishedPost = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "size",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, ["search", "approvalStatus", "postStatus"]);

  const result = await PostService.findAllPublishedPost(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Posts retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

export const PostController = {
  insertPost,
  updateApprovalStatus,
  updatePostStatus,
  deletePost,
  findOnePost,
  findAllPublishedPost,
};
