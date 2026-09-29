import { expect, type Page } from '@playwright/test';

export const CATALOG_URL =
  'https://catalog.staging.palaceproject.io/a1qa-test';

export async function gotoCatalog(page: Page) {
  await page.goto(CATALOG_URL);
  await expect(
    page.getByRole('heading', { name: /404 error:\s*page not found/i }),
    `Expected the configured catalog URL to load a library page, but it rendered the app 404: ${CATALOG_URL}`,
  ).toBeHidden();
  await expect(
    page.getByText(/No authentication document url is configured for the library/i),
    `Expected the configured catalog URL to have an authentication document for this library: ${CATALOG_URL}`,
  ).toBeHidden();
  await expect(page.getByRole('heading', { name: /loading/i })).toBeHidden({ timeout: 30000 });
  await expect(page.getByRole('banner').getByRole('link', { name: /^Catalog$/ })).toBeVisible({
    timeout: 30000,
  });
  await expect(
    page.getByRole('searchbox', { name: /search keyword/i }),
    `Expected the configured catalog URL to load the catalog search UI: ${CATALOG_URL}`,
  ).toBeVisible({ timeout: 30000 });
}
