import z from "zod";

const UserSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters."),

    email: z
      .string()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),

    password: z.string().min(8, "Password must be at least 8 characters long."),

    confirm_password: z.string().min(1, "Please confirm your password."),
  })
  .refine((val) => val.password === val.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match.",
  });

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

export const RegisterSchema = UserSchema.pick({
  username: true,
  email: true,
  password: true,
  confirm_password: true,
})
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
  })
  .refine((val) => val.password === val.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match.",
  });

export const ForgotPasswordSchema = UserSchema.pick({
  email: true,
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).*$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    confirm_password: z.string().min(1, "You need to confirm your password."),
  })
  .refine((val) => val.newPassword === val.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match.",
  });

export const VerifyEmailSchema = z.object({
  codeOTP: z
    .number({ message: "The code must be a number." })
    .min(100000, { message: "The code must be exactly 6 digits." })
    .max(999999, { message: "The code must be exactly 6 digits." }),
});
