import { authenticate } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "src/middleware/validation.middleware";
import { createDesignController } from "src/controllers/design.controller";
import { AddImageToDesignSchema, DesignCreateSchema } from "abipulli-types";
import { placeImageOnDesignController } from "src/controllers/image.toDesignController";

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
