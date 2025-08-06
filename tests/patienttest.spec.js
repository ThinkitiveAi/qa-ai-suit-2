import { test, expect } from '@playwright/test';
// Helper to generate random provider data
function generateRandomProviderData() {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Drew', 'Skyler', 'Quinn', 'Avery'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Anderson'];
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
  const timestamp = Date.now();
  const email = `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}.${timestamp}@yopmail.com`;
  // NPI: 10-digit random number (not starting with 0)
  const npi = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  return {
    firstName: randomFirst,
    lastName: randomLast,
    email,
    npi
  };
}

const provider = generateRandomProviderData();

test.describe('Provider Onboarding', () => {
  test('test', async ({ page }) => {
    await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('RubyVOlague@jourrapide.com');
    await page.getByRole('textbox', { name: '*********' }).click();
    await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
    await page.getByRole('button', { name: 'Let\'s get Started' }).click();
    await page.getByRole('banner').getByTestId('KeyboardArrowRightIcon').click();
    await page.getByRole('tab', { name: 'Settings' }).click();
    await page.getByText('User Settings').click();
    await page.getByRole('tab', { name: 'Providers' }).click();
    await page.getByRole('button', { name: 'Add Provider User' }).click();
    await page.getByRole('textbox', { name: 'First Name *' }).click();
    await page.getByRole('textbox', { name: 'First Name *' }).fill(provider.firstName);
    await page.getByRole('textbox', { name: 'Last Name *' }).click();
    await page.getByRole('textbox', { name: 'Last Name *' }).fill(provider.lastName);
    await page.getByRole('combobox', { name: 'Provider Type' }).click();
    await page.getByRole('option', { name: 'MD' }).click();
    await page.getByRole('combobox', { name: 'specialities' }).click();
    await page.getByRole('option', { name: 'Behavioral Health & Psychiatry' }).click();
    await page.getByRole('combobox', { name: 'Role *' }).click();
    await page.getByRole('option', { name: 'Psychiatrist' }).click();
    await page.getByRole('combobox', { name: 'Gender *' }).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.getByRole('textbox', { name: 'NPI Number', exact: true }).click();
    await page.getByRole('textbox', { name: 'NPI Number', exact: true }).fill(provider.npi);
    await page.getByRole('textbox', { name: 'Email *' }).click();
    await page.getByRole('textbox', { name: 'Email *' }).fill(provider.email);
    await page.getByRole('button', { name: 'Save' }).click();

    // Wait for the grid to update
    await page.waitForTimeout(3000);

    // Try to find a search input for providers (by placeholder)
    let providerSearchInput;
    try {
      await page.waitForSelector('input[placeholder="Find Provider"]', { state: 'visible', timeout: 5000 });
      providerSearchInput = page.getByPlaceholder('Find Provider');
    } catch {
      try {
        await page.waitForSelector('input[placeholder="Search Provider"]', { state: 'visible', timeout: 5000 });
        providerSearchInput = page.getByPlaceholder('Search Provider');
      } catch {
        // If no search input, fallback to grid text search
        providerSearchInput = null;
      }
    }
    if (providerSearchInput) {
      await providerSearchInput.fill(provider.lastName);
      await page.waitForTimeout(1000);
    }
    // Validate provider appears in the grid
    const providerFullName = `${provider.firstName} ${provider.lastName}`;
    await expect(page.getByText(providerFullName, { exact: false })).toBeVisible({ timeout: 10000 });
    // Print provider details in console
    console.log('Provider Created:', provider);
  });
});

// Helper to generate random US patient data
function generateRandomPatientData() {
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Chris', 'Jessica', 'Daniel', 'Ashley'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Anderson'];
  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
  const timestamp = Date.now();
  const email = `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}.${timestamp}@mailinator.com`;
  const randomPhone = `(${Math.floor(200 + Math.random() * 800)}) ${Math.floor(200 + Math.random() * 800)}-${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    firstName: randomFirst,
    lastName: randomLast,
    email,
    phone: randomPhone
  };
}

const patient = generateRandomPatientData();
const patientFullName = `${patient.firstName} ${patient.lastName}`;

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yyyy = tomorrow.getFullYear();
const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
const dd = String(tomorrow.getDate()).padStart(2, '0');
const tomorrowStr = `${mm}/${dd}/${yyyy}`;

test.describe('EHR Patient Creation and Appointment Scheduling', () => {
  test('EHR Patient Creation and Appointment Scheduling - Dynamic Data', async ({ page }) => {
    // 1. Login
    await page.goto('https://stage_ketamin.uat.provider.ecarehealth.com/auth/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('amol.shete+TP@medarch.com');
    await page.getByRole('textbox', { name: '*********' }).fill('Test@123$');
    await page.getByRole('button', { name: "Let\'s get Started" }).click();

    // 2. Create new patient
    await page.getByText('Create').click();
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
    console.log('Patient Created:', {
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone
    });
    await page.waitForTimeout(3000);

    // Validate patient is created in the list
    await page.reload();
    await page.getByRole('tab', { name: 'Patients' }).click();
    let patientSearchInput;
    try {
      await page.waitForSelector('input[placeholder="Find Patient"]', { state: 'visible', timeout: 5000 });
      patientSearchInput = page.getByPlaceholder('Find Patient');
    } catch {
      await page.waitForSelector('input[placeholder="Search Patient"]', { state: 'visible', timeout: 5000 });
      patientSearchInput = page.getByPlaceholder('Search Patient');
    }
    await patientSearchInput.fill(`${patient.lastName}`);
    const pageHtml = await page.content();
    console.log('Page HTML after patient search:', pageHtml);
    await expect(page.getByText(`${patient.firstName} ${patient.lastName}`, { exact: false })).toBeVisible({ timeout: 15000 });
    await page.keyboard.press('Escape');

    
    await page.locator("img[alt='admin image']").click();
    await page.getByText('Log Out').click();
    await page.getByRole('button', { name: 'Yes,Sure' }).click();
  });
});

test.describe('Appointment Scheduling', () => {
  test('Schedule Appointment for Patient', async ({ page }) => {
  // 3. Schedule appointment for the newly created patient
  await page.getByText('Create').click();
  await page.getByText('New Appointment').click();
  await page.getByRole('combobox', { name: 'Patient Name *' }).click();
  await page.getByRole('option', { name: patientFullName, exact: false }).first().click();
  await page.getByRole('combobox', { name: 'Appointment Type *' }).click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).fill('Test');
  await page.getByRole('combobox', { name: 'Timezone *' }).click();
  await page.getByRole('option', { name: /Pacific Daylight Time/ }).click();
  await page.getByRole('button', { name: 'Telehealth' }).click();
  await page.getByRole('combobox', { name: 'Provider *' }).click();
  await page.getByRole('option', { name: 'Chrys Westone' }).click();
  await page.getByRole('button', { name: 'View availability' }).click();
  const dateCells = await page.locator('button, td, div').evaluateAll(nodes => nodes.filter(n => n.getAttribute && (n.getAttribute('aria-label') || n.textContent)).map(n => ({ text: n.textContent, ariaLabel: n.getAttribute('aria-label') })));
  console.log('Date picker cells:', dateCells);
  const plus2 = new Date();
  plus2.setDate(plus2.getDate() + 2);
  const plus2yyyy = plus2.getFullYear();
  const plus2mm = String(plus2.getMonth() + 1).padStart(2, '0');
  const plus2dd = String(plus2.getDate()).padStart(2, '0');
  const plus2Str = `${plus2mm}/${plus2dd}/${plus2yyyy}`;
  let dateSelected = false;
  for (const cell of dateCells) {
    if (cell.ariaLabel && cell.ariaLabel.includes(plus2Str)) {
      await page.getByLabel(cell.ariaLabel).click();
      dateSelected = true;
      break;
    }
    if (cell.text && cell.text.trim() === plus2dd) {
      await page.getByText(plus2dd, { exact: true }).click();
      dateSelected = true;
      break;
    }
  }
  if (!dateSelected) {
    console.log('Could not find current+2 date in the date picker:', plus2Str, 'Cells:', dateCells);
    throw new Error('Current+2 date not found in date picker');
  }
  await page.getByRole('button', { name: /AM|PM/ }).first().click();
  await page.getByRole('button', { name: 'Save And Close' }).click();
  await page.waitForTimeout(3000);
  console.log('Appointment Scheduled:', {
    patient: patientFullName,
    type: 'New Patient Visit',
    reason: 'Test',
    timezone: 'Pacific Daylight Time',
    provider: 'Chrys Westone'
  });

  await page.keyboard.press('Escape');
  await page.reload();
  const schedulingTab = page.getByRole('tab', { name: 'Scheduling' });
  await schedulingTab.waitFor({ state: 'visible', timeout: 10000 });
  await schedulingTab.scrollIntoViewIfNeeded();
  await schedulingTab.click();
  await page.waitForTimeout(1000);
  const appointmentsTab = page.getByText('Appointments');
  await appointmentsTab.waitFor({ state: 'visible', timeout: 10000 });
  await appointmentsTab.scrollIntoViewIfNeeded();
  await appointmentsTab.click();
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Open' }).nth(3).click();
  await page.waitForTimeout(500);
  await page.getByRole('option', { name: 'Month' }).click();
  await page.waitForTimeout(2000);
  let found = false;
  let normalizedRows = [];
  let matchedRow = '';
  let matchedStatus = '';
  for (let i = 0; i < 10; i++) {
    let allRowTexts = [];
    try {
      const rows = await page.locator('.MuiDataGrid-row').all();
      allRowTexts = await Promise.all(rows.map(async row => await row.textContent()));
    } catch {
      const rows = await page.locator("div[role='row']").all();
      allRowTexts = await Promise.all(rows.map(async row => await row.textContent()));
    }
    normalizedRows = allRowTexts.map(text => text ? text.replace(/\s+/g, ' ').trim() : '');
    console.log(`[Retry ${i+1}] All patient row texts after filters:`, normalizedRows);
    matchedRow = normalizedRows.find((text) => text.includes(patient.firstName) && text.includes(patient.lastName) && text.toLowerCase().includes('scheduled')) || '';
    found = Boolean(matchedRow);
    if (found) break;
    await new Promise(res => setTimeout(res, 2000));
  }
  expect(found).toBeTruthy();
  if (matchedRow) {
    const statusMatch = matchedRow.match(/scheduled/i);
    matchedStatus = statusMatch ? statusMatch[0] : '';
  }
  const formattedRow = matchedRow.replace(/(Not Sent)(Scheduled)/g, '$1 $2');
  console.log(`Validated row: ${formattedRow}\nAction extracted: ${matchedStatus}`);
  console.log(`Actual result: Patient Name = ${patient.firstName} ${patient.lastName}, Action = ${matchedStatus} | Expected: Patient Name = ${patient.firstName} ${patient.lastName}, Action = Scheduled`);
  await new Promise(res => setTimeout(res, 4000));
  });
});







