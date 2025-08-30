import { UserRole } from "@prisma/client";

export interface IValidateUser {
  role: UserRole;
  userId: string;
}
