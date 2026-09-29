import { test, expect } from '@playwright/test';
import { CATALOG_URL } from './catalog-url';

test('Catalog home page loads', async ({ page }) => {
  await page.goto(CATALOG_URL);

  await expect(page).toHaveURL(/catalog/);
  await expect(page.locator('body')).toContainText(/.+/);
});
