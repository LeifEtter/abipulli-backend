import db from "db/db";
import { InsertOrder, orders, SelectOrder } from "db/index";
import { NextFunction, Response, Request } from "express";
import { eq } from "drizzle-orm";
import { errorMessages, OrderCreate, OrderUpdate } from "abipulli-types";
import { getOrderById } from "services/order.service";
import { ApiError } from "error/ApiError";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let orderData: OrderCreate = req.body;
    const order: InsertOrder = {
      status: "pending",
      deadline: orderData.deadline ? new Date(orderData.deadline) : undefined,
      user_id: res.locals.user.user_id,
      destination_country: orderData.schoolCountry,
      student_amount: orderData.studentAmount,
      motto: orderData.motto,
      school_name: orderData.school,
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
    const { school, motto, schoolCountry, studentAmount }: OrderUpdate =
      req.body;
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
        destination_country: schoolCountry,
        student_amount: studentAmount,
        school_name: school,
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
