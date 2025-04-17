import db from "db/db";
import { InsertOrder, orders, SelectOrder } from "db/schema";
import { NextFunction, Response, Request } from "express";
import { UserOrderCreateUpdateType } from "validation/schemas/orderSchemas";
import { getOrderById } from "./order.util";
import ApiError from "error/ApiError";
import { errorMessages } from "error/errorMessages";
import { eq } from "drizzle-orm";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      school_name,
      destination_country,
      student_amount,
      deadline,
    }: UserOrderCreateUpdateType = req.body;
    const newOrder: InsertOrder = {
      user_id: res.locals.user.user_id,
    };
    const createdOrder = await db
      .insert(orders)
      .values(newOrder)
      .returning({ order_id: orders.id });
    res.status(201).send({ order_id: createdOrder[0]?.order_id });
  } catch (error) {
    next(error);
  }
};

// Allow partial order creation
export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      school_name,
      motto,
      destination_country,
      student_amount,
    }: UserOrderCreateUpdateType = req.body;
    const deadline = req.body.deadline
      ? new Date(req.body.deadline)
      : undefined;
    const order: SelectOrder | undefined = await getOrderById(res.locals.id);
    if (order == undefined)
      next(new ApiError({ code: 404, info: errorMessages.resourceNotFound }));
    if (order!.user_id != res.locals.user.user_id)
      next(new ApiError({ code: 404, info: errorMessages.resourceNotOwned }));

    await db
      .update(orders)
      .set({
        deadline,
        destination_country,
        student_amount,
        school_name,
        motto,
      })
      .where(eq(orders.id, res.locals.id));
    res.status(200).send("Success");
  } catch (error) {}
};
