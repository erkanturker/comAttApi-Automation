const { test, expect } = require("@playwright/test");
const { getAdminToken } = require("../utils/tokenGenerator");
const DbHelper = require("../dbHelper/DbHelper");

let token;
let dbHelper;

const testData = {
  username: "testUser1",
  password: "12345",
  firstName: "Test",
  lastName: "LastTest",
  email: "test@gmail.com",
  role: "teacher",
};

test.beforeAll(async () => {
  token = await getAdminToken();
  dbHelper = new DbHelper();
  await dbHelper.connect();
});

test.afterAll(async () => {
  await dbHelper.disConnect();
});

test.afterEach(async () => {
  await dbHelper.deleteUser(testData.username);
});

test.describe("GET /users", () => {
  test("Admin Should get all users", async ({ request }) => {
    const respUsers = await request.get("/users", {
      headers: { authorization: `Bearer ${token}` },
    });

    const dbUsers = await dbHelper.getAllUsers();
    const usersPayload = await respUsers.json();

    expect(dbUsers).toEqual(usersPayload);
  });
});

test.describe("GET /users/id", () => {
  test("Admin Should get single user by UserName", async ({ request }) => {
    await dbHelper.addUser(testData);

    const respUsers = await request.get(`/users/${testData.username}`, {
      headers: { authorization: `Bearer ${token}` },
    });

    expect(respUsers.status()).toBe(200);

    const userPayload = await respUsers.json();
    const { password, ...expectedUser } = testData;

    expect(expectedUser).toEqual(userPayload);
  });
});

test.describe("POST /users", () => {
  test("Admin should Create User", async ({ request }) => {
    const respUsers = await request.post("/users", {
      headers: { authorization: `Bearer ${token}` },
      data: testData,
    });

    expect(respUsers.status()).toBe(201);

    const userPayload = await respUsers.json();
    const dbUser = await dbHelper.getUserByUsername(testData.username);

    expect(dbUser).toEqual(userPayload);
  });
});

test.describe("DELETE /users", () => {
  test("Admin can Delete User", async ({ request }) => {
    await dbHelper.addUser(testData);

    const respUsers = await request.delete(`/users/${testData.username}`, {
      headers: { authorization: `Bearer ${token}` },
    });

    expect(respUsers.status()).toBe(200);

    const respPayload = await respUsers.json();

    expect(respPayload.status).toBe("deleted");
  });
});
