import httpStatus from "http-status";
import { ApiError, paginationHelper, prismaClient } from "../../../utils";
import {
  ApprovalStatus,
  Post,
  PostStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { IPaginationOption } from "../../../interfaces/pagination";
import { PostFilterOption } from "./posts.interface";

const insertPost = async (payload: Post, userRole: UserRole): Promise<Post> => {
  let approvalStatus: ApprovalStatus = "Pending";
  let postStatus: PostStatus = "Draft";

  if (userRole === "Admin") {
    approvalStatus = "Approved";
    postStatus = "Published";
  }

  const createdPost = await prismaClient.post.create({
    data: { ...payload, approvalStatus, postStatus, contentJson: "" },
  });

  return createdPost;
};

const updateApprovalStatus = async (
  id: string,
  approvalStatus: ApprovalStatus
) => {
  const postExist = await prismaClient.post.findUnique({
    where: {
      id,
    },
  });

  if (!postExist) throw new ApiError(httpStatus.NOT_FOUND, "Post not exists");

  const post = await prismaClient.post.update({
    where: {
      id,
    },
    data: {
      approvalStatus,
    },
  });

  return post;
};

const updatePostStatus = async (
  id: string,
  postStatus: PostStatus,
  authorId: string
) => {
  const postExist = await prismaClient.post.findUnique({
    where: {
      id,
      authorId: authorId,
    },
  });

  if (!postExist) throw new ApiError(httpStatus.NOT_FOUND, "Post not exists");

  const post = await prismaClient.post.update({
    where: {
      id,
      authorId: authorId,
    },
    data: {
      postStatus,
    },
  });

  return post;
};

const deletePost = async (id: string) => {
  const postExist = await prismaClient.post.findUnique({
    where: {
      id,
    },
  });

  if (!postExist) throw new ApiError(httpStatus.NOT_FOUND, "Post not exists");

  await prismaClient.post.update({
    where: {
      id,
    },
    data: { isDeleted: true },
  });

  return postExist;
};

const findOnePost = async (id: string) => {
  const postExist = await prismaClient.post.findUnique({
    where: {
      id,
      isDeleted: false,
      postStatus: "Published",
      approvalStatus: "Approved",
    },
  });

  if (!postExist) throw new ApiError(httpStatus.NOT_FOUND, "Post not exists");

  return postExist;
};

const findAllPublishedPost = async (
  filterOptions: PostFilterOption,
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
      OR: ["title", "slug", "content", "contentJson"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.PostWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const posts = await prismaClient.post.findMany({
    where: { ...whereCondition, isDeleted: false, postStatus: "Published" },
    skip,
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const count = await prismaClient.post.count({
    where: { ...whereCondition, isDeleted: false, postStatus: "Published" },
  });

  return {
    meta: {
      page,
      size: limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: posts,
  };
};

export const PostService = {
  insertPost,
  findAllPublishedPost,
  findOnePost,
  deletePost,
  updateApprovalStatus,
  updatePostStatus,
};
