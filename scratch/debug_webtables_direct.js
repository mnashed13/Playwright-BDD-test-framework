const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to Web Tables page...');
  await page.goto('https://demoqa.com/webtables', { waitUntil: 'domcontentloaded' });
  
  console.log('Page Title:', await page.title());
  
  // Wait for row group selector
  console.log('Waiting for .rt-tr-group...');
  try {
    await page.waitForSelector('.rt-tr-group', { timeout: 10000 });
    console.log('.rt-tr-group loaded!');
  } catch (e) {
    console.log('Timeout waiting for .rt-tr-group. Let us dump body text.');
    console.log(await page.locator('body').innerText());
    await browser.close();
    return;
  }

  // Let's count rows before adding
  let rowsBefore = await page.locator('.rt-tr-group').count();
  console.log(`Rows before adding: ${rowsBefore}`);
  
  console.log('Clicking Add button...');
  await page.locator('#addNewRecordButton').click({ force: true });
  
  console.log('Waiting for modal...');
  await page.waitForSelector('.modal-content', { timeout: 5000 });
  console.log('Modal loaded!');

  console.log('Filling form...');
  await page.locator('#firstName').fill('Sarah');
  await page.locator('#lastName').fill('Connor');
  await page.locator('#userEmail').fill('sarah@skynet.com');
  await page.locator('#age').fill('35');
  await page.locator('#salary').fill('95000');
  await page.locator('#department').fill('Security');
  
  console.log('Submitting form...');
  await page.locator('#submit').click({ force: true });
  
  console.log('Waiting for modal to disappear...');
  await page.locator('.modal-content').waitFor({ state: 'hidden', timeout: 5000 });
  console.log('Modal closed!');
  
  console.log('Querying rows...');
  const rowCount = await page.locator('.rt-tr-group').count();
  console.log(`Found ${rowCount} rows.`);
  
  for (let i = 0; i < rowCount; i++) {
    const text = await page.locator('.rt-tr-group').nth(i).innerText();
    console.log(`Row ${i} Text:`, JSON.stringify(text));
  }
  
  await browser.close();
  console.log('Done!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
