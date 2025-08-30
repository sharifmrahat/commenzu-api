import { Response } from "express";
import httpstatus from "http-status";

type IData<T> = {
  result?: T;
  message?: string;
  status?: boolean;
  statusCode?: number;
  token?: string;
  meta?: Record<string, unknown>;
};

const responseData = <T>(data: IData<T>, res: Response) => {
  const status = data.status ?? true;
  const statusCode = data.statusCode ?? httpstatus.OK;

  const response = {
    success: status,
    statusCode,
    data: data.result,
    ...(data.message ? { message: data.message } : {}),
    ...(data.token ? { token: data.token } : {}),
    ...(data.meta ? data.meta : {}),
  };

  return res.status(statusCode).json(response);
};

export default responseData;
