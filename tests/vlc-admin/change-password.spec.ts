import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://vlc.staging.palaceproject.io/admin/login/?next=/admin/');
  await page.getByRole('textbox', { name: 'Email address:' }).click();
  await page.getByRole('textbox', { name: 'Email address:' }).fill('courtney.dalessandro@lyrasis.org');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('coqhyp-rawdi2-vySkaf');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Change password' }).click();
});