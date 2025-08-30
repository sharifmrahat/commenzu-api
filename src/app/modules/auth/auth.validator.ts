import { z } from "zod";

const loginAuthZodSchema = z.object({
  body: z.object({
    email: z
      .string()
      .nonempty("Email is required!")
      .email()
      .transform((val) => val.trim().toLowerCase()),
    password: z.string().nonempty("Password is required!"),
  }),
});

const signUpAuthZodSchema = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required!"),
    email: z
      .string()
      .nonempty("Email is required!")
      .email()
      .transform((val) => val.trim().toLowerCase()),
    password: z.string().nonempty("Password is required!"),
  }),
});

export const AuthValidation = {
  loginAuthZodSchema,
  signUpAuthZodSchema,
};
