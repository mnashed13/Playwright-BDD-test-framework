import { Page, Locator, expect } from '@playwright/test';

export class ButtonsPage {
  private readonly page: Page;
  private readonly doubleClickBtn: Locator;
  private readonly rightClickBtn: Locator;
  private readonly dynamicClickBtn: Locator;
  private readonly doubleClickMsg: Locator;
  private readonly rightClickMsg: Locator;
  private readonly dynamicClickMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.doubleClickBtn = page.locator('#doubleClickBtn');
    this.rightClickBtn = page.locator('#rightClickBtn');
    // The "Click Me" button does not have a static ID, so we filter by exact text
    this.dynamicClickBtn = page.locator('button').filter({ hasText: /^Click Me$/ });
    
    this.doubleClickMsg = page.locator('#doubleClickMessage');
    this.rightClickMsg = page.locator('#rightClickMessage');
    this.dynamicClickMsg = page.locator('#dynamicClickMessage');
  }

  /**
   * Navigates to the Buttons page.
   */
  async navigate() {
    await this.page.goto('/buttons');
  }

  /**
   * Performs a double-click on the Double Click Me button.
   */
  async performDoubleClick() {
    await this.doubleClickBtn.dblclick();
  }

  /**
   * Performs a right-click on the Right Click Me button.
   */
  async performRightClick() {
    await this.rightClickBtn.click({ button: 'right' });
  }

  /**
   * Performs a standard left-click on the dynamic Click Me button.
   */
  async performDynamicClick() {
    await this.dynamicClickBtn.scrollIntoViewIfNeeded();
    await this.dynamicClickBtn.click();
  }

  /**
   * Asserts the success text for double clicking.
   */
  async verifyDoubleClickMessage() {
    await expect(this.doubleClickMsg).toHaveText('You have done a double click');
  }

  /**
   * Asserts the success text for right clicking.
   */
  async verifyRightClickMessage() {
    await expect(this.rightClickMsg).toHaveText('You have done a right click');
  }

  /**
   * Asserts the success text for dynamic clicking.
   */
  async verifyDynamicClickMessage() {
    await expect(this.dynamicClickMsg).toHaveText('You have done a dynamic click');
  }
}
