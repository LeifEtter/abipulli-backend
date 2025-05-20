import { Router } from "express";
import {
  generateImage,
  improvePrompt,
  saveImage,
} from "../controllers/image.controller";
import multer from "multer";
import { minPower } from "middleware/authorization.middleware";
import { authenticate } from "middleware/authentication.middleware";
import { validateBody } from "middleware/validation.middleware";
import { GenerateImageSchema, ImproveImageQuerySchema } from "abipulli-types";

const multerClient = multer();
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(authenticate, minPower(1), multerClient.single("image"), saveImage);

router
  .route("/prompt")
  .post(
    authenticate,
    minPower(1),
    validateBody(ImproveImageQuerySchema),
    improvePrompt
  );

router
  .route("/generate")
  .post(
    authenticate,
    minPower(1),
    validateBody(GenerateImageSchema),
    generateImage
  );

export default router;
