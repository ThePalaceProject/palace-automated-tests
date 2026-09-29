import { test, expect } from '@playwright/test';

test.describe('@security VLC Admin security', () => {

  test('unauthenticated user cannot access Libraries page directly', async ({ browser }) => {
    // Create a completely fresh browser context with no saved login/session state.
    const context = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [],
      },
    });

    const page = await context.newPage();

    // Attempt to bypass login by navigating directly to a protected admin page.
    await page.goto('https://vlc.staging.palaceproject.io/admin/libraries/');

    // The protected Libraries URL should not remain accessible.
    expect(new URL(page.url()).pathname).not.toMatch(/^\/admin\/libraries\/?$/);

    // The user should be redirected to authentication.
    await expect(page).toHaveURL(/login|sign.?in/i);

    await context.close();
  });

});
