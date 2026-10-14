
import { Page, expect } from '@playwright/test';

export async function login(page: Page) {
  const username = process.env.VLC_USERNAME;
  const password = process.env.VLC_PASSWORD;

  if (!username || !password) {
    throw new Error('VLC staging credentials are missing');
  }

  await page.goto(
    'https://vlc.staging.palaceproject.io/admin/login/?next=/admin/'
  );

  await page.getByLabel(/email/i).fill(username);
  await page.getByLabel(/password/i).fill(password);

  await page.getByRole('button', { name: /log in/i }).click();

  await expect(page).toHaveURL(
    'https://vlc.staging.palaceproject.io/admin/'
  );
}
