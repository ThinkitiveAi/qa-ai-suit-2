import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { testUser } from '../utils/testData.js';

test('Login - POM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(testUser.email, testUser.password);
  // Assert that dashboard or a known element is visible after login
  await expect(page.getByText('Dashboard', { exact: false })).toBeVisible({ timeout: 10000 });
  // Wait for 3 seconds for visual confirmation
  await new Promise(res => setTimeout(res, 3000));
}); 