import { minPower } from "src/middleware/authorization.middleware";
import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "src/middleware/validation.middleware";
import {
  createDesignController,
  getDesignsForOrderController,
} from "src/controllers/design.controller";
import { AddImageToDesignSchema, DesignCreateSchema } from "abipulli-types";
import { placeImageOnDesignController } from "src/controllers/image.toDesignController";
import { authenticateHttp } from "src/middleware/authentication.middleware";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["orderId"] }),
    validateBody(DesignCreateSchema),
    createDesignController
  );

router
  .route("/")
  .get(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["orderId"] }),
    getDesignsForOrderController
  );

router
  .route("/:designId/image/:imageId")
  .post(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["orderId", "designId", "imageId"] }),
    validateBody(AddImageToDesignSchema),
    placeImageOnDesignController
  );

export default router;
