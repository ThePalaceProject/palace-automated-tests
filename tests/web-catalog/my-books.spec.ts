import { test, expect } from '@playwright/test';
import { signIn, skipWithoutCatalogCredentials } from './auth-utils';

skipWithoutCatalogCredentials(test);
test.setTimeout(60000);

test('My Books page loads for signed-in patron', async ({ page }) => {
  await signIn(page);

  const myBooksLink = page.getByRole('banner').getByRole('link', { name: /My Books/i });
  await expect(myBooksLink).toBeVisible();
  await myBooksLink.click();

  await expect(page).toHaveURL(/\/loans/);
  await expect(page.getByRole('heading', { level: 1, name: /My Books/i })).toBeVisible({
    timeout: 30000,
  });
  await expect(page.getByRole('link', { name: /Sign In/i })).toBeHidden();
  await expect(
    page.getByText(/checked out|no books|no loans|borrowed|unavailable|return/i).first(),
  ).toBeVisible();
});
