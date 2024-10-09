const { test } = require("@playwright/test");

let token;

//second example with Before Each
test.describe("GET Users", () => {
  test.beforeEach(async ({ request }) => {
    const respToken = await request.post("/auth/token", {
      data: { username: "admin", password: "12345" },
    });
    const respPayload = await respToken.json();
    token = respPayload.token;
  });

  test("Log All User", async ({ request }) => {
    const respUsers = await request.get("/users", {
      headers: { authorization: `Bearer ${token}` },
    });

    const usersPayload = await respUsers.json();

    console.log(usersPayload);
  });
});

// First Example with Serial
test.describe.serial("Users API", () => {
    test("console token fixture", async ({ request }) => {
      const respToken = await request.post("/auth/token/", {
        data: { username: "admin", password: "12345" },
      });
  
      expect(respToken.status()).toBe(200);
  
      const respTokenJson = await respToken.json();
      token = respTokenJson["token"];
  
      console.log(token);
    });
  
    test("get users response", async ({ request }) => {
      const respUser = await request.get("/users", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
  
      const users = await respUser.json();
  
      console.log(users);
    });
  });
  
