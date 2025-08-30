import { IOptionsResult, IPaginationOption } from "../../interfaces/pagination";

export const paginationHelper = (
  options: IPaginationOption
): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.size || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
