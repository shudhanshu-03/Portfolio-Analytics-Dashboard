# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard E2E >> should add a widget from the catalogue
- Location: e2e\dashboard.spec.ts:26:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Add Widget")')

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Dashboard E2E', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Navigate to the app
  6  |     await page.goto('/');
  7  |   });
  8  | 
  9  |   test('should load the dashboard and display the empty state', async ({ page }) => {
  10 |     // Assert title or header exists
  11 |     await expect(page.locator('text=Meridian Analytics').first()).toBeVisible();
  12 |     
  13 |     // Assert empty state is visible
  14 |     await expect(page.locator('text=Your Dashboard is Empty')).toBeVisible();
  15 |     await expect(page.locator('text=Open Widget Library')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('should open command palette', async ({ page }) => {
  19 |     // Click the search hint in the header
  20 |     await page.click('text=Search...');
  21 |     
  22 |     // Assert command palette is visible
  23 |     await expect(page.locator('[placeholder="Type a command or search..."]')).toBeVisible();
  24 |   });
  25 | 
  26 |   test('should add a widget from the catalogue', async ({ page }) => {
  27 |     // Click Add Widget button
> 28 |     await page.click('button:has-text("Add Widget")');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  29 |     
  30 |     // Assert catalogue is visible
  31 |     await expect(page.locator('text=Widget Library')).toBeVisible();
  32 |     
  33 |     // Add "Holdings Data Table"
  34 |     const widgetCard = page.locator('.border', { hasText: 'Holdings Data Table' }).first();
  35 |     await widgetCard.locator('button').click();
  36 |     
  37 |     // Close the modal
  38 |     await page.keyboard.press('Escape');
  39 |     
  40 |     // Assert the widget is on the screen (the empty state should disappear)
  41 |     await expect(page.locator('text=Your Dashboard is Empty')).not.toBeVisible();
  42 |     await expect(page.locator('text=Holdings Data Table').first()).toBeVisible();
  43 |   });
  44 | });
  45 | 
```