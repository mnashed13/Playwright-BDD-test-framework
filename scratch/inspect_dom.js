const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to Web Tables page...');
  await page.goto('https://demoqa.com/webtables', { waitUntil: 'domcontentloaded' });
  
  console.log('Waiting for "Cierra" text to be present...');
  await page.locator('text=Cierra').first().waitFor({ state: 'visible', timeout: 10000 });
  console.log('"Cierra" is visible!');
  
  // Find the element containing "Cierra" and traverse up to inspect parents
  const elementInfo = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.textContent === 'Cierra');
    if (!el) return 'Element with text "Cierra" not found exactly';
    
    let current = el;
    const path = [];
    while (current && current !== document.body) {
      path.push({
        tagName: current.tagName,
        className: current.className,
        id: current.id
      });
      current = current.parentElement;
    }
    return path;
  });
  
  console.log('DOM Path for "Cierra":');
  console.log(JSON.stringify(elementInfo, null, 2));
  
  await browser.close();
  console.log('Done!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
