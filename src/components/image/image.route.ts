import { Router } from "express";
import { saveImage } from "./image.controller";
import multer from "multer";
import { minPower } from "auth/authorization";
import { authenticate } from "auth/authentication";

const multerClient = multer();
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(authenticate, minPower(1), multerClient.single("image"), saveImage);

export default router;
