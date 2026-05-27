import { test, expect } from '@playwright/test';

test('debug webtables', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables');
  await page.locator('#addNewRecordButton').click({ force: true });
  
  await page.locator('#firstName').fill('Sarah');
  await page.locator('#lastName').fill('Connor');
  await page.locator('#userEmail').fill('sarah@skynet.com');
  await page.locator('#age').fill('35');
  await page.locator('#salary').fill('95000');
  await page.locator('#department').fill('Security');
  await page.locator('#submit').click({ force: true });

  console.log('--- Form Submitted ---');
  
  // Wait a little bit for any transitions
  await page.waitForTimeout(2000);

  // Let's print all row group text contents
  const rowGroups = page.locator('.rt-tr-group');
  const count = await rowGroups.count();
  console.log(`Number of .rt-tr-group rows: ${count}`);
  for (let i = 0; i < count; i++) {
    const text = await rowGroups.nth(i).innerText();
    console.log(`Row ${i} Text:`, JSON.stringify(text));
  }

  // Let's print the entire table body HTML or content
  const tableBody = page.locator('.rt-tbody');
  if (await tableBody.count() > 0) {
    console.log('Table Body HTML exists.');
  }
});
