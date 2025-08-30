import { UserRole } from "../../../generated/prisma";

export interface IValidateUser {
  role: UserRole;
  userId: string;
}
