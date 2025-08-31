import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ApiError, JwtHelpers } from "../../utils";
import { IValidateUser } from "../modules/auth/auth.interface";
import { UserRole } from "@prisma/client";

//* To Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: IValidateUser;
    }
  }
}

export const validateRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization || !authorization.startsWith("Bearer ")) {
        return next("Invalid token!");
      }

      const token = authorization.split(" ")[1];

      const user = JwtHelpers.verifyToken(token) as IValidateUser;

      req.user = user;

      if (roles?.length) {
        if (!user.role || !roles.includes(user.role)) {
          throw new ApiError(httpStatus.FORBIDDEN, "Forbidden Access!");
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
