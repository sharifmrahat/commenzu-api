import jwt, { Secret } from "jsonwebtoken";
import config from "../../config";

const generateToken = (data: Record<string, unknown>) => {
  var token = jwt.sign(data, config.JWT_SECRET_ACCESS as Secret, {
    expiresIn: "30d",
  });
  return token;
};

const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, config.JWT_SECRET_ACCESS as Secret);
  return decoded;
};

export const JwtHelpers = {
  generateToken,
  verifyToken,
};
