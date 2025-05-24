import { Router } from "express";
import {
  generateImageController,
  getMyImagesController,
  improvePromptController,
  saveImageController,
} from "../controllers/image.controller";
import { minPower } from "src/middleware/authorization.middleware";
import { authenticate } from "src/middleware/authentication.middleware";
import { validateBody } from "src/middleware/validation.middleware";
import { GenerateImageSchema, ImproveImageQuerySchema } from "abipulli-types";
import { uploadSingleImage } from "src/middleware/file.middleware";

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

router.route("/me").get(authenticate, minPower(1), getMyImagesController);

export default router;
