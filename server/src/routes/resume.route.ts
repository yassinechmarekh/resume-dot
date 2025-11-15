import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware";
import {
  validateBody,
  validateImageUploaded,
  validateObjectId,
} from "../middlewares/validation.middleware";
import {
  CreateResumeSchema,
  EnhanceTextSchema,
  UpdateResumeSchema,
  UploadResumeImageSchema,
  UploadResumeSchema,
} from "../utils/schemas/resume.schema";
import {
  createResumeController,
  deleteResumeController,
  enhanceTextController,
  getSpecificResumeController,
  getUserResumesController,
  updateResumeController,
  uploadResumeController,
  uploadResumeImageController,
} from "../controllers/resume.controller";
import upload from "../config/multer";

const router = Router();

// ~/api/resume/create
router
  .route("/create")
  .post(
    isAuthenticated,
    validateBody(CreateResumeSchema),
    createResumeController
  );

// ~/api/resume/upload
router
  .route("/upload")
  .post(
    isAuthenticated,
    validateBody(UploadResumeSchema),
    uploadResumeController
  );

// ~/api/resume/all
router.route("/all").get(isAuthenticated, getUserResumesController);

// ~/api/resume/upload-profile-image
router
  .route("/upload-profile-image/:resumeId")
  .post(
    isAuthenticated,
    validateObjectId("resumeId"),
    upload.single("image"),
    validateImageUploaded("Resume profile image"),
    validateBody(UploadResumeImageSchema),
    uploadResumeImageController
  );

// ~/api/resume/enhance-text
router
  .route("/enhance-text")
  .post(validateBody(EnhanceTextSchema), enhanceTextController);

// ~/api/resume/:resumeId
router
  .use("/:resumeId", isAuthenticated, validateObjectId("resumeId"))
  .route("/:resumeId")
  .get(getSpecificResumeController)
  .put(validateBody(UpdateResumeSchema), updateResumeController)
  .delete(deleteResumeController);

export default router;
