import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { AppointmentPage } from '../pages/appointment.page.js';
import { testUser, popLatestPatientName } from '../utils/testData.js';

test('Schedule Appointment - POM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const appointmentPage = new AppointmentPage(page);

  // Login
  await loginPage.login(testUser.email, testUser.password);

  const patientFullName = popLatestPatientName();
  if (!patientFullName) throw new Error('No patient available to schedule. Please run patient test first.');

  await appointmentPage.scheduleAppointment(patientFullName);

  // Navigate to Scheduling > Appointments
  await page.keyboard.press('Escape');
  await page.reload();
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByText('Appointments').click();

  // Wait and scroll to grid
  await page.waitForSelector('.MuiDataGrid-row, div[role="row"]', { timeout: 10000 });
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));

  // Change view to 'Month'
  await page.getByRole('button', { name: 'Open' }).nth(3).click();
  await page.getByRole('option', { name: 'Month' }).click();

  // Find scheduled appointment row
  let found = false;
  let matchedRow = '';
  for (let attempt = 0; attempt < 10; attempt++) {
    const rows = await page.locator('.MuiDataGrid-row, div[role="row"]').all();
    const texts = await Promise.all(rows.map(r => r.textContent()));
    matchedRow = texts.find(text => text?.includes(patientFullName) && /scheduled/i.test(text)) || '';
    if (matchedRow) {
      found = true;
      break;
    }
    await page.waitForTimeout(2000);
  }

  expect(found).toBeTruthy();

  // Extract status for logging
  const statusMatch = matchedRow.match(/scheduled/i);
  console.log(`✅ Patient "${patientFullName}" found with status: ${statusMatch?.[0] || 'Unknown'}`);
});
