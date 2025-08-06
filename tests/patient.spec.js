import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { CreatePatientPage } from '../pages/patient.page.js';
import { testUser, generateRandomPatientData, appendPatientName } from '../utils/testData.js';

test('Create Patient test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const createPatientPage = new CreatePatientPage(page);

  // Generate patient data
  const patient = generateRandomPatientData();
  const patientFullName = `${patient.firstName} ${patient.lastName}`;

  // Login
  await loginPage.login(testUser.email, testUser.password);

  // Create patient
  await createPatientPage.createPatient(patient);
  // Wait after clicking Save
  await page.waitForTimeout(3000);

  // Print patient information to the console
  console.log('Patient Created:', patient);

  // After creation, click the Patients tab, then select Patient List
  await page.getByRole('tab', { name: 'Patients' }).click();
  await page.getByText('Patient List', { exact: false }).click();
  await page.waitForTimeout(1000);

  // Use XPath to search for the newly created patient
  const searchInput = await page.locator("//input[@placeholder='Search Patient']");
  await searchInput.fill(patientFullName);
  await page.waitForTimeout(1000);

  // Validate the patient is found in the search results by checking both name and unique email
  // Only extract patient list table rows for validation and output
  const normalizedFullName = patientFullName.replace(/\s+/g, ' ').trim();
  const normalizedEmail = patient.email.replace(/\s+/g, ' ').trim();
  const patientTableRows = await page.locator('.MuiDataGrid-row').allTextContents();
  const normalizedTableRows = patientTableRows.map(text => text.replace(/\s+/g, ' ').trim());
  const patientRows = normalizedTableRows.filter(text => text.includes(normalizedFullName) && text.includes(normalizedEmail));
  if (patientRows.length > 0) {
    const matchedResult = patientRows[0];
    // Try to extract fields using a more flexible regex
    // We'll use the known values for year and gender
    // Extract Patient ID (assume it is the first word in the row, matching /^[A-Z0-9]{6,}/)
    const idMatch = matchedResult.match(/^[A-Z0-9]{6,}/);
    const patientId = idMatch ? idMatch[0] : '';
    const year = patient.dob.split('-')[2];
    const gender = patient.gender;
    const nameBlock = `${patient.firstName} ${patient.lastName}\n${year} ${gender}`;
    console.log('Validated Patient:');
    console.table([
      {
        'Patient ID': patientId,
        'Name': nameBlock,
        'Phone': patient.phone,
        'Email': patient.email
      }
    ]);
    appendPatientName(patientFullName);
  }
  expect(patientRows.length > 0).toBeTruthy();

  // Wait for 3 seconds for visual confirmation
  await new Promise(res => setTimeout(res, 3000));
}); 