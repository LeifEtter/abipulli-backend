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
import {
  generateImageSchema,
  improveImageQuerySchema,
} from "schemas/imageSchema";

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
