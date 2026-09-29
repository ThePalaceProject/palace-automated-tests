import { test, expect, type Page } from '@playwright/test';
import { gotoCatalog } from './catalog-url';

test.describe.configure({ mode: 'serial' });
test.setTimeout(90000);

async function waitForCatalogContent(page: Page) {
  await expect(page.getByRole('heading', { name: /loading/i })).toBeHidden({ timeout: 60000 });
}

async function openFictionSwimlane(page: Page) {
  const fictionSwimlane = page
    .getByRole('heading', { name: /^Fiction collection$/ })
    .locator('xpath=ancestor::*[.//a[normalize-space()="See More"]][1]');

  await fictionSwimlane.getByRole('link', { name: /^See More$/ }).click();
  await expect(page).toHaveURL(/\/collection\//);
  await waitForCatalogContent(page);
  await expect(page.getByRole('heading', { level: 1, name: /^Fiction$/ })).toBeVisible({
    timeout: 30000,
  });
}

async function openFictionResults(page: Page) {
  await openFictionSwimlane(page);
  await page.getByRole('link', { name: /^See All All Fiction$/ }).click();
  await expect(page).toHaveURL(/\/collection\//);
  await waitForCatalogContent(page);
  await expect(page.getByRole('combobox', { name: /Sort by/i })).toBeVisible({
    timeout: 30000,
  });
}

async function gotoCurrentCollectionWithFilters(
  page: Page,
  filters: Record<string, string>,
) {
  const currentUrl = new URL(page.url());
  const [catalogPath, encodedFeedUrl] = currentUrl.pathname.split('/collection/');

  if (!encodedFeedUrl) {
    throw new Error(`Expected to be on a collection URL before applying filters, but got: ${page.url()}`);
  }

  const feedUrl = new URL(decodeURIComponent(encodedFeedUrl));
  for (const [filterName, filterValue] of Object.entries(filters)) {
    feedUrl.searchParams.set(filterName, filterValue);
  }

  await page.goto(`${currentUrl.origin}${catalogPath}/collection/${encodeURIComponent(feedUrl.toString())}`);
  await waitForCatalogContent(page);
}

test('See More opens swimlane results', async ({ page }) => {
  await gotoCatalog(page);

  await openFictionSwimlane(page);

  await expect(page.getByRole('heading', { level: 1, name: /^Fiction$/ })).toBeVisible();
  await expect(page.getByRole('link', { name: / - (eBook|Audiobook), by /i }).first()).toBeVisible();
});

test('Automated Tests swimlane opens a stable book detail page', async ({ page }) => {
  await gotoCatalog(page);

  const automatedTestsSwimlane = page
    .getByRole('heading', { name: /^Automated Tests collection$/ })
    .locator('xpath=ancestor::li[1]');
  const titleLink = automatedTestsSwimlane.getByRole('link', { name: / - (eBook|Audiobook), by /i }).first();

  await expect(titleLink).toBeVisible({ timeout: 30000 });
  await titleLink.click();

  await expect(page).toHaveURL(/\/book\//);
  await expect(page.getByRole('heading', { level: 1, name: /Book title:/i })).toBeVisible({
    timeout: 30000,
  });
  await expect(page.getByRole('button', { name: /^Borrow$/ })).toBeVisible();
});

test('View More loads additional results', async ({ page }) => {
  await gotoCatalog(page);
  await openFictionResults(page);

  const titleLinks = page.getByRole('link', { name: /details page/i });
  const initialCount = await titleLinks.count();

  await page.getByRole('button', { name: /View More/i }).click();

  await expect.poll(async () => titleLinks.count()).toBeGreaterThan(initialCount);
});

test('Availability filter updates catalog results', async ({ page }) => {
  await gotoCatalog(page);
  await openFictionResults(page);

  await expect(page.getByRole('combobox', { name: /Sort by/i })).toBeVisible();
  const availabilityFilter = page.getByRole('combobox', { name: /Availability/i });
  await expect(availabilityFilter).toBeVisible();
  await expect(page.getByRole('combobox', { name: /Distributor/i })).toBeVisible();
  await expect(page.getByRole('combobox', { name: /Collection Name/i })).toBeVisible();

  await availabilityFilter.selectOption({ label: 'Available now' });

  await expect(page).toHaveURL(/available%3Dnow|available=now/i);
  await waitForCatalogContent(page);
  await expect(page.getByText(/Book Status:\s*Available to borrow/i).first()).toBeVisible();
});

test('Distributor filter updates catalog results', async ({ page }) => {
  await gotoCatalog(page);
  await openFictionResults(page);

  const distributorFilter = page.getByRole('combobox', { name: /Distributor/i });
  await expect(distributorFilter).toBeVisible();

  await distributorFilter.selectOption({ label: 'Overdrive' });

  await expect(page).toHaveURL(/distributor%3DOverdrive|distributor=Overdrive/i);
  await waitForCatalogContent(page);
  await expect(
    page.getByRole('link', { name: /details page/i }).and(page.locator('a[href*="Overdrive"]')).first(),
  ).toBeVisible();
});

test('Overdrive yours-to-keep filter combination shows no results', async ({ page }) => {
  await gotoCatalog(page);
  await openFictionResults(page);

  await expect(page.getByRole('combobox', { name: /Availability/i })).toContainText('Yours to keep');
  await expect(page.getByRole('combobox', { name: /Distributor/i })).toContainText('Overdrive');

  await gotoCurrentCollectionWithFilters(page, {
    available: 'always',
    distributor: 'Overdrive',
  });
  await expect(page).toHaveURL(/distributor%3DOverdrive|distributor=Overdrive/i);
  await expect(page).toHaveURL(/available%3Dalways|available=always/i);
  await expect(
    page.getByRole('combobox', { name: /Availability/i }).locator('option:checked'),
  ).toHaveText('Yours to keep');
  await expect(
    page.getByRole('combobox', { name: /Distributor/i }).locator('option:checked'),
  ).toHaveText('Overdrive');
  await expect(page.getByText('This collection is empty.')).toBeVisible();
});

test('Breadcrumb links navigate back to catalog home', async ({ page }) => {
  await gotoCatalog(page);
  await openFictionSwimlane(page);

  await page.getByRole('link', { name: /^All Books$/ }).click();

  await expect(page).toHaveURL(/\/collection\//);
  await waitForCatalogContent(page);
  await expect(page.getByRole('heading', { level: 1, name: /^A1QA Test Library$/ })).toBeVisible();
});
