const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to Web Tables page...');
  await page.goto('https://demoqa.com/webtables', { waitUntil: 'domcontentloaded' });
  
  console.log('Waiting for table rows...');
  await page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 10000 });
  
  const rows = await page.locator('tbody tr').all();
  console.log(`Found ${rows.length} rows in tbody.`);
  
  for (let i = 0; i < Math.min(rows.length, 3); i++) {
    const text = await rows[i].innerText();
    const html = await rows[i].innerHTML();
    console.log(`Row ${i} Text:`, JSON.stringify(text));
    console.log(`Row ${i} HTML:`, html);
  }
  
  await browser.close();
  console.log('Done!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
