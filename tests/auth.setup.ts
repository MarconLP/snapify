import { test as setup } from "@playwright/test";

const authFile = "tests/.auth/user.json";
const sessionToken = "a961d605-c8fe-4dc9-a8d9-da0f81957053";

setup("authenticate", async ({ page }) => {
  await page.context().addCookies([
    {
      name: "next-auth.session-token",
      value: sessionToken,
      path: "/",
      domain: "localhost",
    },
  ]);

  await page.context().storageState({ path: authFile });
});
