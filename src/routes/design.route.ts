import { authenticate } from "middleware/authentication.middleware";
import { minPower } from "middleware/authorization.middleware";
import { Router } from "express";
import { validateBody, validateParams } from "middleware/validation.middleware";
import { createDesignController } from "controllers/design.controller";
import { AddImageToDesignSchema, DesignCreateSchema } from "abipulli-types";
import { placeImageOnDesignController } from "controllers/image.toDesignController";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenticate,
    minPower(1),
    validateParams({ requiredParams: ["orderId"] }),
    validateBody(DesignCreateSchema),
    createDesignController
  );

router
  .route("/:designId/image/:imageId")
  .post(
    authenticate,
    minPower(1),
    validateParams({ requiredParams: ["designId", "imageId"] }),
    validateBody(AddImageToDesignSchema),
    placeImageOnDesignController
  );
export default router;
