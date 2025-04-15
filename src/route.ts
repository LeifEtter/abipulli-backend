import { Router } from "express";
import userRouter from "./components/user/user.route";
const router = Router();

router.use("/user", userRouter);

export default router;
