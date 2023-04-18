import { test, expect } from "@playwright/test";

test.describe("billing", () => {
  test("should see pro plan banner", async ({ page }) => {
    await page.goto("http://localhost:3000/videos");
    await expect(page.locator("h2.text-3xl")).toContainText(
      "Simple no-tricks pricing"
    );
  });

  test("should be able to subscribe", async ({ page }) => {
    await page.goto("http://localhost:3000/videos");
    await page.getByText("Get access").click();
    await expect(
      page.locator('span[data-testid="product-summary-name"]')
    ).toContainText("Subscribe to Pro Plan");

    await page.click("#cardNumber");
    await page.fill("#cardNumber", "4242 4242 4242 42422");
    await page.click("#cardExpiry");
    await page.fill("#cardExpiry", "12 / 26");
    await page.click("#cardCvc");
    await page.fill("#cardCvc", "123");
    await page.click("#billingName");
    await page.fill("#billingName", "E2E Account");
    await page.click(
      ".UpsellToggle-clickContainer:nth-child(2) .HostedSwitchControl"
    );

    await page.waitForTimeout(1000);

    await Promise.all([
      page.click(".SubmitButton-IconContainer"),
      page.waitForNavigation(),
    ]);

    await expect(page.locator("div.gap-14 > div > span")).toContainText(
      "You do not have any recordings."
    );
  });
});
