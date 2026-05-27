import { Page, Locator, expect } from '@playwright/test';

export class AlertsPage {
  private readonly page: Page;
  private readonly alertButton: Locator;
  private readonly timerAlertButton: Locator;
  private readonly confirmButton: Locator;
  private readonly promptButton: Locator;
  
  private readonly confirmResult: Locator;
  private readonly promptResult: Locator;

  constructor(page: Page) {
    this.page = page;
    this.alertButton = page.locator('#alertButton');
    this.timerAlertButton = page.locator('#timerAlertButton');
    this.confirmButton = page.locator('#confirmButton');
    // Note: demoqa has a typo in id 'promtButton'
    this.promptButton = page.locator('#promtButton');
    
    this.confirmResult = page.locator('#confirmResult');
    this.promptResult = page.locator('#promptResult');
  }

  /**
   * Navigates to the Alerts page.
   */
  async navigate() {
    await this.page.goto('/alerts');
  }

  /**
   * Triggers a standard alert and dismisses it.
   */
  async triggerAlert() {
    this.page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      await dialog.dismiss();
    });
    await this.alertButton.click();
  }

  /**
   * Triggers an alert that appears after 5 seconds, and accepts it.
   */
  async triggerTimerAlert() {
    this.page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      await dialog.accept();
    });
    await this.timerAlertButton.click();
    // Wait for 5 seconds for the alert to trigger and resolve
    await this.page.waitForTimeout(5500);
  }

  /**
   * Triggers a confirmation dialog and accepts (Clicks OK).
   */
  async triggerConfirm(accept: boolean) {
    this.page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
    await this.confirmButton.click();
  }

  /**
   * Triggers a prompt dialog, types answer, and accepts.
   */
  async triggerPrompt(answerText: string) {
    this.page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept(answerText);
    });
    await this.promptButton.click();
  }

  /**
   * Asserts the confirmation selection result message.
   */
  async verifyConfirmResult(expectedText: string) {
    await expect(this.confirmResult).toContainText(expectedText);
  }

  /**
   * Asserts the prompt input result message.
   */
  async verifyPromptResult(expectedText: string) {
    await expect(this.promptResult).toContainText(expectedText);
  }
}
