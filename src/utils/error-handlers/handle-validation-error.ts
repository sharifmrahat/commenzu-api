import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IGenericErrorResponse } from "../../interfaces/error";

export const handleValidationError = (
  error: PrismaClientKnownRequestError
): IGenericErrorResponse => {
  const errors = [
    {
      path: "",
      message: error.message,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessages: errors,
  };
};
