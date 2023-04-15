import { expect, test } from "@playwright/test";

test("should be able to view video", async ({ page }) => {
  await page.goto("http://localhost:3000/videos");
  await page.locator("div.grid > a:nth-child(1)").click();
  await expect(page).toHaveURL(/http:\/\/localhost:3000\/share\/[A-Za-z0-9]+/);

  const video = page.locator("video");
  expect(video).toBeTruthy();
  await video.evaluate((v: HTMLVideoElement) => v.play());
  const isPlaying = await video.evaluate((v: HTMLVideoElement) => !v.paused);
  expect(isPlaying).toBe(true);
  await video.click();
  const isPaused = await video.evaluate((v: HTMLVideoElement) => v.paused);
  expect(isPaused).toBe(true);
});
