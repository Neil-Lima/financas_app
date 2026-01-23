import { test, expect } from '@playwright/test';
import { registerAndLogin } from '../src/playwrite/auth.mjs';

test('smoke: login + dashboard', async ({ page }) => {
  test.setTimeout(120000);

  await registerAndLogin(page);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
});
