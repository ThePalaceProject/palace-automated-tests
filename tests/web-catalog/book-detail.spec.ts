import { test, expect } from '@playwright/test';
import { gotoCatalog } from './catalog-url';

test.setTimeout(60000);

test('Can open a book detail page', async ({ page }) => {
  await gotoCatalog(page);

  const bookTitle = 'Dune: House Atreides #1';

  await page.getByRole('searchbox', { name: /search keyword/i }).fill(bookTitle);
  await page.getByRole('button', { name: /search/i }).click();

  const bookDetailsLink = page
    .getByRole('link', { name: new RegExp(`^${bookTitle} - details page$`) })
    .first();

  await expect(bookDetailsLink).toBeVisible({ timeout: 30000 });
  await bookDetailsLink.click();

  await expect(page).toHaveURL(/\/book\//);

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: new RegExp(`Book title:\\s*${bookTitle}`, 'i'),
    }),
  ).toBeVisible();

  await expect(page.getByText(/Brian Herbert/i).first()).toBeVisible();
  await expect(page.getByText(/Kevin J\. Anderson/i).first()).toBeVisible();
});