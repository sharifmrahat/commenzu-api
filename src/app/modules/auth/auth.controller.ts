import { catchAsync, responseData } from "../../../utils";
import { AuthService } from "./auth.service";

const signup = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await AuthService.signUp(user);

  return responseData(
    {
      result,
      message: "User successfully singed up!",
    },
    res
  );
});

const login = catchAsync(async (req, res) => {
  const userCredential = req.body;

  const result = await AuthService.login(userCredential);

  return responseData(
    {
      message: "User logged in successfully!",
      token: result,
    },
    res
  );
});

export const AuthController = {
  signup,
  login,
};
