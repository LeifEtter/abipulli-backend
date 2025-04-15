import request from "supertest";
import { afterAll, beforeAll, expect, it } from "vitest";
import { describe } from "node:test";
import { deleteUser } from "components/user/user.util";
import app from "app";
const mockUser = {
  name: "Super Tester",
  email: "supertesting@Test.com",
  password: "Test@1234",
};

afterAll(async () => {
  await deleteUser({ email: mockUser.email });
});

describe("Testing User Registration/Login Flow", () => {
  it("should test registration of a new user", async () => {
    await request(app)
      .post("/user/register")
      .send({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      })
      .expect(201)
      .then((res) => {});
  });

  it("should respond with error when user tries to register with an already registered email", async () => {
    await request(app)
      .post("/user/register")
      .send({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      })
      .expect(400)
      .then((res) => {
        const body = res.body;
        expect(body).toEqual(
          expect.objectContaining({
            err_code: expect.any(Number),
            err_msg: expect.any(String),
          })
        );
        expect(body["err_code"]).toEqual(1);
      });
  });

  it("should test user login with correct credentials", async () => {
    await request(app)
      .post("/user/login")
      .send({ email: mockUser.email, password: mockUser.password })
      .expect(200)
      .then((res) => {
        const body = res.body;
        expect(body).toEqual(
          expect.objectContaining({
            token: expect.any(String),
          })
        );
      });
  });
});
