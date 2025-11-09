import z from "zod";

const UserSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),

  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export const RegisterSchema = UserSchema.pick({
  username: true,
  email: true,
  password: true,
});
// .extend({
//   password: z
//     .string()
//     .min(8, "Password must be at least 8 characters long.")
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).*$/,
//       "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
//     ),
// });

export const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});

export const VerifyEmailSchema = z.object({
  otp: z
    .number({ error: "The OTP code must be a number." })
    .min(100000, "The OTP code must be exactly 6 digits long.")
    .max(999999, "The OTP code must be exactly 6 digits long."),
});

export const ForgotPasswordSchema = UserSchema.pick({
  email: true,
});

export const ResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).*$/,
    //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    // ),
});
