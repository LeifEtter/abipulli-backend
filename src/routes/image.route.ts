import { Router } from "express";
import {
  generateImageController,
  improvePromptController,
  saveImageController,
} from "../controllers/image.controller";
import { minPower } from "middleware/authorization.middleware";
import { authenticate } from "middleware/authentication.middleware";
import { validateBody } from "middleware/validation.middleware";
import { GenerateImageSchema, ImproveImageQuerySchema } from "abipulli-types";
import { uploadSingleImage } from "middleware/file.middleware";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenticate,
    minPower(1),
    uploadSingleImage("image"),
    saveImageController
  );

router
  .route("/prompt")
  .post(
    authenticate,
    minPower(1),
    validateBody(ImproveImageQuerySchema),
    improvePromptController
  );

router
  .route("/generate")
  .post(
    authenticate,
    minPower(1),
    validateBody(GenerateImageSchema),
    generateImageController
  );

export default router;
