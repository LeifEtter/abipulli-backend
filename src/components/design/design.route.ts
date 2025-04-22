import { authenticate } from "auth/authentication";
import { minPower } from "auth/authorization";
import { Router } from "express";
import { validateBody, validateParams } from "validation/validationMiddleware";
import { createDesign, placeImageOnDesign } from "./design.controller";
import {
  createDesignSchema,
  placeImageOnDesignSchema,
} from "validation/schemas/designSchema";
import imageRouter from "components/image/image.route";

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
