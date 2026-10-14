
import { test, expect } from '@playwright/test';

test('Verify failure reporting', async ({ page }) => {
  await page.goto('about:blank');

  await expect(page.locator('body')).toContainText(
    'INTENTIONAL FAILURE FOR REPORTING TEST'
  );
});
