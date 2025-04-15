import request from "supertest";
import app from "../../src/app";
import { deleteUser } from "../../src/components/user/user.helper";

const mockUser = {
  name: "Super Tester",
  email: "supertesting@Test.com",
  password: "Test@1234",
};

afterAll(() => {
  deleteUser({ email: mockUser.email });
});

describe("Testing User Registration Flow", () => {
  it("should test user registration", async () => {
    await request(app)
      .post("/user/register")
      .send({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      })
      .expect(201)
      .end((err, res) => {});
  });

  it("should test user login", async () => {
    await request(app)
      .post("/user/login")
      .send({ email: mockUser.email, password: mockUser.password })
      .expect(200)
      .end((err, res) => {
        const body = res.body;
        expect(body).toHaveProperty("token");
        expect(body).toHaveProperty("user_id");
      });
  });
});
