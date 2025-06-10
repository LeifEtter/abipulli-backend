import db from "src/db/db";
import { InsertOrder, orders, SelectOrder } from "src/db/index";
import { NextFunction, Response, Request } from "express";
import { eq } from "drizzle-orm";
import {
  errorMessages,
  Order,
  OrderCreateParams,
  OrdersResponse,
  OrderUpdateParams,
} from "abipulli-types";
import {
  getOrderById,
  getOrdersByUserID,
} from "src/services/orders/getOrderById.service";
import { ApiError } from "src/error/ApiError";

export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: number = res.locals.user.user_id;
    const orders: Order[] | null = await getOrdersByUserID(userId);
    if (!orders) return next(ApiError.notFound({ resource: "Orders" }));
    const ordersResponse: OrdersResponse = {
      success: true,
      data: {
        page: 1,
        pageSize: orders.length,
        items: orders,
        total: orders.length,
      },
    };
    res.status(200).send(ordersResponse);
  } catch (error) {
    next(error);
  }
};

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let orderData: OrderCreateParams = req.body;
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
export const updateOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { school, motto, schoolCountry, studentAmount }: OrderUpdateParams =
      req.body;
    const deadline = req.body.deadline
      ? new Date(req.body.deadline)
      : undefined;
    const order: Order | undefined = await getOrderById(res.locals.id);
    if (!order) return next(ApiError.notFound({ resource: "Order" }));
    if (order.customerId != res.locals.user.user_id)
      return next(ApiError.notOwned({ resource: "Order" }));

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

export const deleteOrderController = async (
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
