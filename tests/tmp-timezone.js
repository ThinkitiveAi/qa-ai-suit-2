const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://stage_ketamin.uat.provider.ecarehealth.com/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('amol.shete+TP@medarch.com');
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill('Test@123$');
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();
  await page.getByTestId('AddCircleOutlineOutlinedIcon').locator('path').click();
  await page.getByText('New Appointment').click();
  await page.getByRole('combobox', { name: 'Patient Name *' }).click();
  await page.getByRole('option', { name: 'Alba Kozey-Cole 16 Nov' }).click();
  await page.getByRole('combobox', { name: 'Appointment Type *' }).click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).fill('Testing');
  await page.getByRole('combobox', { name: 'Timezone *' }).click();
  await page.getByRole('option', { name: 'Pacific Daylight Time (GMT -' }).click();
  await page.getByRole('button', { name: 'Telehealth' }).click();
  await page.locator('div').filter({ hasText: /^Provider \*$/ }).nth(1).click();
  await page.getByRole('combobox', { name: 'Provider *' }).fill('Chrys Westone');
  await page.getByRole('option', { name: 'Chrys Westone' }).click();
  await page.getByRole('button', { name: 'View availability' }).click();
  await page.getByRole('gridcell', { name: '15' }).click();
  await page.getByRole('button', { name: ':15 PM - 10:30 PM' }).click();
  await page.getByRole('button', { name: 'Save And Close' }).click();
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByText('Appointments').click();
  await page.getByText('Alba Kozey-Cole (1E7EB736)').first().click();
  await page.close();

  // ---------------------
  await context.close();
  await browser.close();
})();