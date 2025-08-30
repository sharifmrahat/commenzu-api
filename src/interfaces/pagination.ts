export interface IPaginationOption {
  size?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IOptionsResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}
