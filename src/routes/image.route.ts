import { Router } from "express";
import {
  generateImageController,
  getMyImagesController,
  improvePromptController,
  saveImageController,
} from "../controllers/image.controller";
import { minPower } from "src/middleware/authorization.middleware";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import {
  validateBody,
  validateParams,
} from "src/middleware/validation.middleware";
import { uploadSingleImage } from "src/middleware/file.middleware";
import {
  GenerateImageParamsSchema,
  ImproveImageParamsSchema,
  ImproveImageQueryParamsSchema,
} from "abipulli-types";
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenticateHttp,
    minPower(1),
    uploadSingleImage("image"),
    saveImageController
  );

// router
//   .route("/free")
//   .get(authenticateHttp, minPower(1), getFreeMotivesController);

router
  .route("/prompt")
  .post(
    authenticateHttp,
    minPower(1),
    validateBody(ImproveImageQueryParamsSchema),
    improvePromptController
  );

router
  .route("/generate")
  .post(
    authenticateHttp,
    minPower(1),
    validateBody(GenerateImageParamsSchema),
    generateImageController
  );

router.route("/me").get(authenticateHttp, minPower(1), getMyImagesController);

// router
//   .route("/improve")
//   .post(authenticateHttp, minPower(1), validateBody(ImproveImageParamsSchema));

export default router;
