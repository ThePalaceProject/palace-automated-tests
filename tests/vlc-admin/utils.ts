import { Page } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('https://vlc.staging.palaceproject.io/admin/login/?next=/admin/');

  await page.getByLabel(/email/i).fill(process.env.VLC_USERNAME!);
  await page.getByLabel(/password/i).fill(process.env.VLC_PASSWORD!);

  await page.getByRole('button', { name: /log in/i }).click();
}