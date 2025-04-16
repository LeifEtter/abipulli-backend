import { Router } from "express";
import userRouter from "./components/user/user.route";
import orderRouter from "./components/order/order.route";
const router = Router();

router.use("/user", userRouter);
router.use("/order", orderRouter);

export default router;
