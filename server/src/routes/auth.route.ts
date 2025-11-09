import { Router } from "express";
import {
  validateBody,
  validateObjectId,
  validateParam,
} from "../middlewares/validation.middleware";
import {
  ForgotPasswordSchema,
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
} from "../utils/schemas/auth.schema";
import {
  forgotPasswordController,
  getProfileDataController,
  googleCallbackController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerificationController,
  resetPasswordController,
  verifyAccessTokenController,
  verifyEmailController,
  verifyResetPasswordTokenController,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { HttpStatusCode } from "../utils/constants";
import passport from "../config/passport";

const router = Router();

// ~/api/auth/register
router
  .route("/register")
  .post(validateBody(RegisterSchema), registerController);

// ~/api/auth/login
router.route("/login").post(validateBody(LoginSchema), loginController);

// ~/api/auth/verify-email/:userId
router
  .route("/verify-email/:userId")
  .post(
    validateObjectId("userId"),
    validateBody(VerifyEmailSchema),
    verifyEmailController
  );

// ~/api/auth/resend-otp/:userId
router
  .route("/resend-otp/:userId")
  .get(validateObjectId("userId"), resendEmailVerificationController);

// ~/api/auth/forgot-password
router
  .route("/forgot-password")
  .post(validateBody(ForgotPasswordSchema), forgotPasswordController);

// ~/api/auth/reset-password/:token
router
  .route("/reset-password/:token")
  .post(
    validateParam("token"),
    validateBody(ResetPasswordSchema),
    resetPasswordController
  );

// ~/api/auth/verify-reset-password-token/:token
router
  .route("/verify-reset-password-token/:token")
  .get(validateParam("token"), verifyResetPasswordTokenController);

// ~/api/auth/profile-data
router.route("/profile-data").get(isAuthenticated, getProfileDataController);

// ~/api/auth/logout
router.route("/logout").get(isAuthenticated, logoutController);

// ~/api/auth/refresh
router.route("/refresh").get(refreshTokenController);

// ~/api/auth/verify-token
router.route("/verify-token").get(verifyAccessTokenController);

// ~/api/auth/google
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: true,
  })
);

// ~/api/auth/google/callback
router.route("/google/callback").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
  }),
  googleCallbackController
);

// ~/api/auth/google/failure
router.route("/google/failure").get((req, res) => {
  res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Google authentication failed" });
});

export default router;
