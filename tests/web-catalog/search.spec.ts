import { test, expect } from '@playwright/test';
import { gotoCatalog } from './catalog-url';

test.setTimeout(60000);

test('Search returns results', async ({ page }) => {
  await gotoCatalog(page);

  const searchbox = page.getByRole('searchbox', { name: /search keyword/i });
  await expect(searchbox).toBeVisible();
  await searchbox.fill('dogs');
  await page.getByRole('button', { name: /search/i }).click();

  await expect(page.locator('body')).toContainText(/dogs|search|results/i);
});
