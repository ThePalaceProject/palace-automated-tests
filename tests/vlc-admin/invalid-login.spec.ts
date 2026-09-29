import { test, expect } from '@playwright/test';

test('Invalid login shows error', async ({ page }) => {
  await page.goto('https://vlc.staging.palaceproject.io/admin/login/?next=/admin/');

  await page.getByLabel(/email/i).fill(process.env.VLC_USERNAME!);
  await page.getByLabel(/password/i).fill('definitely-wrong-password');
  await page.getByRole('button', { name: /log in/i }).click();

  await expect(page).toHaveURL(/login/);
  await expect(page.getByText(/please enter the correct email address and password/i)).toBeVisible();
});