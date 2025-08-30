import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IGenericErrorMessage } from "../../interfaces/error";
import { ApiError, handleValidationError, handleClientError } from "./index";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof PrismaClientKnownRequestError) {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof PrismaClientKnownRequestError) {
    const simplifiedError = handleClientError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: error?.stack,
  });
};
