import { expect, type Page, type TestType } from '@playwright/test';
import { CATALOG_URL } from './catalog-url';

export const libraryCard = process.env.CPW_LIBRARY_CARD;
export const password = process.env.CPW_PASSWORD;

export function skipWithoutCatalogCredentials(test: TestType<any, any>) {
  test.skip(
    !libraryCard || !password,
    'Set CPW_LIBRARY_CARD and CPW_PASSWORD to run web catalog auth tests.',
  );
}

export async function signIn(page: Page) {
  await page.goto(`${CATALOG_URL}/login?nextUrl=%2Fa1qa-test`);

  await page.getByLabel(/Library Card input/i).fill(libraryCard!);
  await page.getByLabel(/Password input/i).fill(password!);
  await page.getByRole('button', { name: /^Login$/ }).click();

  await expect(page).toHaveURL(CATALOG_URL, { timeout: 60000 });
  await expect(page.getByRole('link', { name: /Sign In/i })).toBeHidden();
  await expect(page.getByRole('button', { name: /^Account$/ })).toBeVisible({
    timeout: 30000,
  });
  await expect(
    page.getByRole('banner').getByRole('link', { name: /My Books/i }),
  ).toBeVisible();
}
