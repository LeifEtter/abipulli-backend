import { authenticate } from "middleware/authentication.middleware";
import { minPower } from "middleware/authorization.middleware";
import { Router } from "express";
import { validateBody, validateParams } from "middleware/validation.middleware";
import {
  createDesign,
  placeImageOnDesign,
} from "controllers/design.controller";
import { AddImageToDesignSchema, DesignCreateSchema } from "abipulli-types";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenticate,
    minPower(1),
    validateParams({ requiredParams: ["orderId"] }),
    validateBody(DesignCreateSchema),
    createDesign
  );

router
  .route("/:designId/image/:imageId")
  .post(
    authenticate,
    minPower(1),
    validateParams({ requiredParams: ["designId", "imageId"] }),
    validateBody(AddImageToDesignSchema),
    placeImageOnDesign
  );
export default router;
