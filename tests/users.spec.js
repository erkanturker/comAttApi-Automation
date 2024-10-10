const { test } = require("@playwright/test");
const { getAdminToken } = require("../utils/tokenGenerator");

let token;

test.describe("GET Users", () => {
  test.beforeEach(async () => {
    token = await getAdminToken();
    console.log(token);
  });

  test("Log All User", async ({ request }) => {
    const respUsers = await request.get("/users", {
      headers: { authorization: `Bearer ${token}` },
    });

    const usersPayload = await respUsers.json();

    console.log(usersPayload);
  });
});
