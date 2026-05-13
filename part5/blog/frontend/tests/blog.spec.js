const { test, expect } = require('@playwright/test');

test('homepage has correct title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Assert the title
  await expect(page).toHaveTitle(/Example Domain/);
});

test('clicking a link navigates correctly', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Click a link
  await page.click('a');

  // Assert new URL
  await expect(page).toHaveURL(/iana\.org/);
});
