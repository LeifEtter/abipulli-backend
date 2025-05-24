import { afterAll, beforeAll, describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import request from "supertest";
import { mockUtils, testUtils } from "./utils";
import app from "../../src/app";

// Globals used in Tests
let exampleAuthToken: string;
let exampleUserId1: number;
let exampleUserId2: number;
let exampleOrderId1: number;
let exampleOrderId2: number;

beforeAll(async () => {
  // Create Example User 1 And gen token
  exampleUserId1 = await testUtils.insertUser(mockUtils.user({ roleId: 2 }));
  exampleAuthToken = jwt.sign(
    { user_id: exampleUserId1, role_power: 1 },
    process.env.JWT_SECRET!
  );
  exampleOrderId1 = await testUtils.insertOrder(
    mockUtils.order({ userId: exampleUserId1 })
  );
  // Create Example User 2 and add an order for him
  exampleUserId2 = await testUtils.insertUser(mockUtils.user({ roleId: 2 }));
  exampleOrderId2 = await testUtils.insertOrder(
    mockUtils.order({ userId: exampleUserId2 })
  );
});

afterAll(async () => {
  await testUtils.deleteUser(exampleUserId1);
  await testUtils.deleteUser(exampleUserId2);
});

describe("order functionality", () => {
  it("should test order creation with correct params", async () => {
    const res = await request(app)
      .post("/order/create")
      .set("Authorization", "bearer " + exampleAuthToken)
      .send(mockUtils.order({ userId: exampleUserId1 }))
      .expect(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        order_id: expect.any(Number),
      })
    );
  });

  it("should test order creation with less params", async () => {
    const order = mockUtils.order({ userId: exampleUserId1 });
    order.deadline = undefined;
    order.motto = undefined;
    const res = await request(app)
      .post("/order/create")
      .set("Authorization", "bearer " + exampleAuthToken)
      .send(mockUtils.order({ userId: exampleUserId1 }))
      .expect(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        order_id: expect.any(Number),
      })
    );
  });

  it("should test order creation with incorrect token", async () => {
    const res = await request(app)
      .post("/order/create")
      .set("Authorization", "bearer " + "someFaultyToken")
      .send(mockUtils.order({ userId: exampleUserId1 }))
      .expect(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        err_code: 4,
        err_msg: expect.any(String),
      })
    );
  });

  it("should test order updating", async () => {
    const res = await request(app)
      .patch(`/order/update/${exampleOrderId1}`)
      .set("Authorization", "bearer " + exampleAuthToken)
      .send({ deadline: "01/01/2026" })
      .expect(200);
  });

  it("should test order updating with order that doesn't belong to user", async () => {
    const res = await request(app)
      .patch(`/order/update/${exampleOrderId2}`)
      .set("Authorization", "bearer " + exampleAuthToken)
      .send({ deadline: "01/01/2026" })
      .expect(401);
  });
});
