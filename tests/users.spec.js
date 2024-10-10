const { test, expect } = require("@playwright/test");
const { getAdminToken } = require("../utils/tokenGenerator");
const DbHelper = require("../dbHelper/DbHelper");

let token;

test.describe("GET Users", () => {
  test.beforeEach(async () => {
    token = await getAdminToken();
    console.log(token);
  });

  test("Log All User", async ({ request }) => {
    const dbHelper = new DbHelper();
    await dbHelper.connect();

    const respUsers = await request.get("/users", {
      headers: { authorization: `Bearer ${token}` },
    });

    const dbUsers = await dbHelper.getAllUsers();
    const usersPayload = await respUsers.json();

    expect(dbUsers).toEqual(usersPayload);

    await dbHelper.disConnect();
  });
});
