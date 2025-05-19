import { authenticate } from "middleware/authentication.middleware";
import { minPower } from "middleware/authorization.middleware";
import { Router } from "express";
import { validateBody, validateParams } from "middleware/validation.middleware";
import {
  createDesignSchema,
  placeImageOnDesignSchema,
} from "schemas/designSchema";
import {
  createDesign,
  placeImageOnDesign,
} from "controllers/design.controller";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenticate,
    minPower(1),
    validateParams({ requiredParams: ["orderId"] }),
    validateBody(createDesignSchema),
    createDesign
  );

router
  .route("/:designId/image/:imageId")
  .post(
    authenticate,
    minPower(1),
    validateParams({ requiredParams: ["designId", "imageId"] }),
    validateBody(placeImageOnDesignSchema),
    placeImageOnDesign
  );
export default router;
