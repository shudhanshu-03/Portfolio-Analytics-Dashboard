import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should load the dashboard and display the empty state', async ({ page }) => {
    // Assert title or header exists
    await expect(page.locator('text=Meridian Analytics').first()).toBeVisible();
    
    // Assert empty state is visible
    await expect(page.locator('text=Your Dashboard is Empty')).toBeVisible();
    await expect(page.locator('text=Open Widget Library')).toBeVisible();
  });

  test('should open command palette', async ({ page }) => {
    // Click the search hint in the header
    await page.click('text=Search...');
    
    // Assert command palette is visible
    await expect(page.locator('[placeholder="Type a command or search..."]')).toBeVisible();
  });

  test('should add a widget from the catalogue', async ({ page }) => {
    // Click Add Widget button
    await page.click('button:has-text("Add Widget")');
    
    // Assert catalogue is visible
    await expect(page.locator('text=Widget Library')).toBeVisible();
    
    // Add "Holdings Data Table"
    const widgetCard = page.locator('.border', { hasText: 'Holdings Data Table' }).first();
    await widgetCard.locator('button').click();
    
    // Close the modal
    await page.keyboard.press('Escape');
    
    // Assert the widget is on the screen (the empty state should disappear)
    await expect(page.locator('text=Your Dashboard is Empty')).not.toBeVisible();
    await expect(page.locator('text=Holdings Data Table').first()).toBeVisible();
  });
});
