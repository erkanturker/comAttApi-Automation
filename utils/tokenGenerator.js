const { request } = require("@playwright/test");

async function tokenGenerator(credentials) {
  const apiRequest = await request.newContext();

  const respToken = await apiRequest.post("/auth/token", {
    data: credentials,
  });

  if (!respToken.ok()) {
    throw new Error("Token is not generated");
  }

  const tokenPayload = await respToken.json();

  return tokenPayload.token;
}

async function getAdminToken() {
  const adminCredentials = JSON.parse(process.env.ADMIN_CREDENTIALS);
  return await tokenGenerator(adminCredentials);
}

async function getTeacherToken() {
  const teacherCredentials = JSON.parse(process.env.ADMIN_CREDENTIALS);
  return await tokenGenerator(teacherCredentials);
}

module.exports = { getAdminToken, getTeacherToken };
