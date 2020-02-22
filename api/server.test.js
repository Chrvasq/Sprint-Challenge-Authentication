const request = require("supertest");
const server = require("./server");
const Users = require("../auth/user-model");
const db = require("../database/dbConfig");
const bcrypt = require("bcryptjs");

beforeEach(async () => {
  await db("users").truncate();
});

describe("server", () => {
  it("should be the testing environment", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
  describe("/register", () => {
    it("should return a 201 CREATED status on successful register", async () => {
      const response = await request(server)
        .post("/api/auth/register")
        .send({
          username: "Chris",
          password: "pass"
        });

      expect(response.status).toEqual(201);
    });
    it("should return a JSON object", async () => {
      const response = await request(server)
        .post("/api/auth/register")
        .send({
          username: "Chris",
          password: "pass"
        });
      expect(response.status).toBe(201);
      expect(response.type).toEqual("application/json");
    });
  });
  describe("/login", () => {
    it("should return 200 OK status on successful login", async () => {
      const user = await Users.add({
        username: "Chris",
        password: bcrypt.hashSync("pass", 10)
      });

      const { username } = user;

      const res = await request(server)
        .post("/api/auth/login")
        .send({ username, password: "pass" });

      expect(res.status).toBe(200);
    });
    it("should return 401 on unsuccessful login", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "Chris", password: "pass" });

      expect(res.status).toBe(401);
    });
  });
  describe("/jokes", () => {
    it("should require authentication", async () => {
      const res = await request(server).get("/api/jokes");

      expect(res.status).toBe(401);
    });
    it("responds with application/json type", async () => {
      const res = await request(server).get("/api/jokes");

      expect(res.type).toBe("application/json");
    });
  });
});
