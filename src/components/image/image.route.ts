import { Router } from "express";
import { generateImage, improvePrompt, saveImage } from "./image.controller";
import multer from "multer";
import { minPower } from "auth/authorization";
import { authenticate } from "auth/authentication";
import { validateBody } from "validation/validationMiddleware";
import {
  generateImageSchema,
  improveImageQuerySchema,
} from "validation/schemas/imageSchema";

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
    validateBody(improveImageQuerySchema),
    improvePrompt
  );

router
  .route("/generate")
  .post(
    authenticate,
    minPower(1),
    validateBody(generateImageSchema),
    generateImage
  );

export default router;
