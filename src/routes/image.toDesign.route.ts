import { AddImageToDesignSchema } from "abipulli-types";
import { placeImageOnDesignController } from "controllers/image.toDesignController";
import { Router } from "express";
import { authenticate } from "middleware/authentication.middleware";
import { minPower } from "middleware/authorization.middleware";
import { validateBody } from "middleware/validation.middleware";
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenticate,
    minPower(2),
    validateBody(AddImageToDesignSchema),
    placeImageOnDesignController
  );

export default router;
