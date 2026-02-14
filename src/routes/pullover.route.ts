import { Design, errorMessages } from "abipulli-types";
import { NextFunction, Request, Response, Router } from "express";
import { getAllPulloversController } from "src/controllers/pullover.controller";
import { ApiError } from "src/error/ApiError";
import { authenticateHttp } from "src/middleware/authentication.middleware";
import { minPower } from "src/middleware/authorization.middleware";
import { validateParams } from "src/middleware/validation.middleware";
import { getDesignById } from "src/services/designs/getDesigns.service";
import { updateDesignPullover } from "src/services/designs/updateDesignPullover.service";
import { fetchPulloverById } from "src/services/pullovers/fetchPullovers.service";

const router: Router = Router({ mergeParams: true });

router.route("/").get(authenticateHttp, minPower(1), getAllPulloversController);

// Deny resource not allowed
router
  .route("/:pulloverId")
  .patch(
    authenticateHttp,
    minPower(1),
    validateParams({ requiredParams: ["designId", "pulloverId"] }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { designId, pulloverId } = res.locals.params;
        if (!designId || !pulloverId)
          return next(ApiError.internal({ errorInfo: null }));
        const design: Design | undefined = await getDesignById(designId);
        if (!design) return next(ApiError.notFound({ resource: "Design" }));
        if (design.customerId != res.locals.user.user_id)
          return next(ApiError.notOwned({ resource: "Design" }));
        await fetchPulloverById(pulloverId!);
        await updateDesignPullover({ designId, pulloverId });
        res.status(200).send("Design Pullover geändert");
      } catch (error) {
        next(error);
      }
    },
  );

export default router;
