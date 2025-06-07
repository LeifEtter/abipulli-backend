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
import { placeImageOnDesignController } from "src/controllers/image.toDesignController";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import {
  AddImageToDesignParamsSchema,
  DesignCreateParamsSchema,
} from "abipulli-types";
import imageToDesignRouter from "./image.toDesign.route";

const router = Router({ mergeParams: true });

router.use("/:designId/image", imageToDesignRouter);

router
  .route("/")
  .post(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["orderId"] }),
    validateBody(DesignCreateParamsSchema),
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
    validateBody(AddImageToDesignParamsSchema),
    placeImageOnDesignController
  );

export default router;
