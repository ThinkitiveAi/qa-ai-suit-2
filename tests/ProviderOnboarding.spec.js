
import { test, expect } from '@playwright/test';

function getRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getRandomEmail() {
  return `${getRandomString(8)}@yopmail.com`;
}

function getRandomNPI() {
  return String(Math.floor(1000000000 + Math.random() * 9000000000));
}

// Add arrays of UK and US based first and last names
const firstNames = [
  'James', 'John', 'Robert', 'Michael', 'William', // US
  'David', 'Richard', 'Joseph', 'Thomas', 'Charles', // US
  'Oliver', 'George', 'Harry', 'Jack', 'Jacob', // UK
  'Noah', 'Charlie', 'Muhammad', 'Thomas', 'Oscar' // UK
];
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', // US
  'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Martinez', // US
  'Taylor', 'Wilson', 'Davies', 'Evans', 'Thomas', // UK
  'Johnson', 'Roberts', 'Walker', 'Wright', 'Thompson' // UK
];

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

test.describe('Provider Onboarding and Availability', () => {
  let page;
  let firstName, lastName, email, npi;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('RubyVOlague@jourrapide.com');
    await page.getByRole('textbox', { name: '*********' }).click();
    await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
    await page.getByRole('button', { name: "Let's get Started" }).click();
  });

  test('Add Provider, Set Availability, and Create Patient', async () => {
    firstName = getRandomFromArray(firstNames);
    lastName = getRandomFromArray(lastNames);
    email = getRandomEmail();
    npi = getRandomNPI();

    await page.getByRole('tab', { name: 'Settings' }).click();
    try {
      await expect(page.getByText('User Settings')).toBeVisible({ timeout: 15000 });
      await page.getByText('User Settings').click();
    } catch (e) {
      const bodyText = await page.locator('body').innerText();
      // eslint-disable-next-line no-console
      console.log('User Settings not found. Page body:', bodyText);
      throw e;
    }
    await page.getByRole('tab', { name: 'Providers' }).click();
    await page.getByRole('button', { name: 'Add Provider User' }).click();
    await page.getByRole('textbox', { name: 'First Name *' }).click();
    await page.getByRole('textbox', { name: 'First Name *' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Last Name *' }).click();
    await page.getByRole('textbox', { name: 'Last Name *' }).fill(lastName);
    await page.getByRole('combobox', { name: 'Provider Type' }).click();
    await page.getByRole('option', { name: 'MD' }).click();
    await page.getByRole('combobox', { name: 'specialities' }).click();
    await page.getByRole('option', { name: 'Behavioral Health & Psychiatry' }).getByRole('checkbox').check();
    await page.getByRole('combobox', { name: 'Role *' }).click();
    await page.getByRole('option', { name: 'Provider' }).click();
    await page.getByRole('combobox', { name: 'Gender *' }).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.getByRole('textbox', { name: 'NPI Number', exact: true }).click();
    await page.getByRole('textbox', { name: 'NPI Number', exact: true }).fill(npi);
    await page.getByRole('textbox', { name: 'Email *' }).click();
    await page.getByRole('textbox', { name: 'Email *' }).fill(email);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(2000);
    const closeIcons = await page.locator('[data-testid="CloseIcon"]').filter({ has: page.locator('div[role="presentation"][title="Add Provider User"]') });
    if (await closeIcons.count() > 0) {
      await closeIcons.first().click();
    } else {
      await page.locator('[data-testid="CloseIcon"]:visible').first().click();
    }
    const providerRow = page.locator(`text=${firstName} ${lastName}`);
    await expect(providerRow).toBeVisible();
    // eslint-disable-next-line no-console
    console.log('New Provider Added:', { firstName, lastName, email, npi });

    // Set Availability for the same provider
    await page.reload();
    await page.waitForTimeout(2000);
    await page.getByRole('tab', { name: 'Scheduling' }).click();
    await page.getByText('Availability').click();
    await page.getByRole('button', { name: 'Edit Availability' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('combobox', { name: 'Select Provider *' }).click();
    await page.getByRole('combobox', { name: 'Select Provider *' }).fill(firstName);
    await page.getByRole('option', { name: `${firstName} ${lastName}` }).click();
    await page.getByRole('combobox', { name: 'Time Zone *' }).click();
    await page.getByRole('option', { name: 'Pacific Daylight Time (UTC -7)' }).click();
    await page.getByRole('combobox', { name: 'Booking Window *' }).click();
    await page.getByRole('option', { name: '6 Week', exact: true }).click();
    await page.getByRole('tab', { name: 'Thursday' }).click();
    await page.getByRole('combobox', { name: 'Start Time *' }).click();
    await page.getByRole('option', { name: '12:00 AM' }).click();
    await page.getByRole('combobox', { name: 'End Time *' }).click();
    await page.getByRole('option', { name: ':45 PM (23 hrs 45 mins)' }).click();
    await page.getByRole('checkbox', { name: 'Telehealth' }).check();
    await page.getByRole('combobox', { name: 'Duration' }).click();
    await page.getByRole('option', { name: '30 minutes' }).click();
    await page.getByRole('combobox', { name: 'Schedule Notice' }).click();
    await page.getByRole('combobox', { name: 'Schedule Notice' }).click();
    await page.locator('div').filter({ hasText: /^Appointment TypeAppointment TypeDurationDurationSchedule NoticeSchedule Notice$/ }).first().click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(2000);
    // Wait for any dialogs to disappear after saving availability
    await page.locator('.MuiDialog-container').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    // eslint-disable-next-line no-console
    console.log('Set Availability:', {
      provider: `${firstName} ${lastName}`,
      day: 'Thursday',
      startTime: '12:00 AM',
      endTime: ':45 PM (23 hrs 45 mins)',
      visitMode: 'Telehealth',
      duration: '30 minutes',
      timezone: 'Pacific Daylight Time (UTC -7)',
      bookingWindow: '6 Week'
    });

    // Patient data generation
    const patient = {
      firstName: getRandomFromArray(firstNames),
      lastName: getRandomFromArray(lastNames),
      email: getRandomEmail(),
      phone: '555' + Math.floor(1000000 + Math.random() * 9000000)
    };

    // Patient creation steps
    // Click the 'Create' button (which opens a menu)
    await page.locator('div[aria-haspopup="true"]').getByText('Create').click();
    await page.getByText('New Patient', { exact: true }).click();
    await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img').click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('textbox', { name: 'First Name *' }).fill(patient.firstName);
    await page.getByRole('textbox', { name: 'Last Name *' }).fill(patient.lastName);
    await page.getByRole('textbox', { name: /Date of Birth/i }).fill('01-01-2000');
    await page.locator('form').filter({ hasText: 'Gender *Gender *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(patient.phone);
    await page.getByRole('textbox', { name: 'Email *' }).fill(patient.email);
    await page.getByRole('button', { name: 'Save' }).click();
    console.log('Patient Created:', patient);
    await page.waitForTimeout(3000);

    // Removed logout flow as per user request
    /*
    try {
      await page.locator("img[alt='admin image']").click();
      await page.getByText('Log Out').click();
      await page.getByRole('button', { name: 'Yes,Sure' }).click();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Logout skipped: page already closed or not available.');
    }
    */
  });

  test.afterAll(async () => {
    await page.close();
  });
});