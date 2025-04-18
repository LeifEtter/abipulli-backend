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
    let orderData: UserOrderCreateUpdateType = req.body;
    console.log(res.locals.user.user_id);
    const order: InsertOrder = {
      deadline: orderData.deadline ? new Date(orderData.deadline) : undefined,
      user_id: res.locals.user.user_id,
      destination_country: orderData.destination_country,
      student_amount: orderData.student_amount,
      motto: orderData.motto,
      school_name: orderData.school_name,
    };
    const createdOrder = await db
      .insert(orders)
      .values(order)
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
      return next(
        new ApiError({ code: 404, info: errorMessages.resourceNotFound })
      );
    if (order!.user_id != res.locals.user.user_id)
      return next(
        new ApiError({ code: 401, info: errorMessages.resourceNotOwned })
      );

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
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId: number = res.locals.id;
    const { user_id, role_power } = res.locals.user;
    const deletedOrders = await db
      .delete(orders)
      .where(eq(orders.id, orderId))
      .returning();
    if (deletedOrders.length == 0) {
      return next(
        new ApiError({ code: 404, info: errorMessages.resourceNotFound })
      );
    }
    if (role_power < 10 && deletedOrders[0]?.user_id != user_id) {
      return next(
        new ApiError({ code: 401, info: errorMessages.resourceNotOwned })
      );
    }
    res.status(200).send("Delete Successful");
  } catch (error) {
    next(error);
  }
};
