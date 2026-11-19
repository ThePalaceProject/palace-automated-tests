import { test, expect, type Locator } from '@playwright/test';
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

  const emptyCollection = page.getByRole('heading', {
    level: 2,
    name: 'Your books will show up here when you have any loaned or on hold.',
  });
  const books = page.getByRole('listitem').filter({
    has: page.getByRole('link', { name: / - details page$/ }),
  });

  await expect(emptyCollection.or(books.first())).toBeVisible();

  if (await emptyCollection.isVisible()) {
    await expect(books).toHaveCount(0);
    return;
  }

  const bookCount = await books.count();
  expect(bookCount).toBeGreaterThan(0);
  for (let index = 0; index < bookCount; index++) {
    await expectShelfEntry(books.nth(index));
  }
});

async function expectShelfEntry(book: Locator) {
  await expect(book.getByRole('link', { name: / - details page$/ }).first()).toBeVisible();
  await expect(book.getByRole('img', { name: /^Cover for .+/ })).toBeVisible();
  await expect(book.getByText(/Authors:\s*\S/)).toBeVisible();

  const cancelReservation = book.getByRole('button', { name: /^Cancel Reservation$/ });
  const returnLoan = book.getByRole('button', { name: /^Return$/ });
  const readyHold = book.getByRole('button', { name: /^Borrow$/ });

  await expect(cancelReservation.or(returnLoan).or(readyHold)).toBeVisible();

  if (await cancelReservation.isVisible()) {
    await expect(book.getByText(/Book Status:\s*Reserved/)).toBeVisible();
    await expect(
      book.getByText(/Book Availability:\s*\d+ patrons? ahead of you in the queue\./),
    ).toBeVisible();
    return;
  }

  if (await returnLoan.isVisible()) {
    await expect(book.getByText(/Book Availability:\s*Due .+/)).toBeVisible();
    return;
  }

  await expect(book.getByText(/Book Status:\s*Ready to Borrow/)).toBeVisible();
  await expect(
    book.getByText(/Book Availability:\s*You have this book on hold(?: until .+)?\./),
  ).toBeVisible();
}
