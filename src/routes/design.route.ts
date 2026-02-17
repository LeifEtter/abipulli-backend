import { minPower } from "src/middleware/authorization.middleware";
import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "src/middleware/validation.middleware";
import {
  createDesignController,
  deleteDesignController,
  getAllUserDesignsController,
  getDesignsForOrderController,
} from "src/controllers/design.controller";
import { placeImageOnDesignController } from "src/controllers/image.toDesign.controller";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import {
  AddImageToDesignParamsSchema,
  DesignCreateParamsSchema,
} from "abipulli-types";
import imageToDesignRouter from "./image.toDesign.route";
import pulloverRouter from "./pullover.route";
import { deleteDesignById } from "src/services/designs/deleteDesign.service";

const router = Router({ mergeParams: true });

router.use("/:designId/image", imageToDesignRouter);
router.use("/:designId/pullover", pulloverRouter);

router
  .route("/")
  .post(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["orderId"] }),
    validateBody(DesignCreateParamsSchema),
    createDesignController,
  );

router
  .route("/")
  .get(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["orderId"] }),
    getDesignsForOrderController,
  );

router
  .route("/:designId/image/:imageId")
  .post(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["orderId", "designId", "imageId"] }),
    validateBody(AddImageToDesignParamsSchema),
    placeImageOnDesignController,
  );

router
  .route("/:designId")
  .delete(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["orderId", "designId"] }),
    deleteDesignController,
  );

router
  .route("/me")
  .get(authenticateHttp, minPower(1), getAllUserDesignsController);

export default router;
