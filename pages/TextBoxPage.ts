import { Page, Locator, expect } from '@playwright/test';

export class TextBoxPage {
  private readonly page: Page;
  private readonly fullNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly currentAddressInput: Locator;
  private readonly permanentAddressInput: Locator;
  private readonly submitButton: Locator;
  private readonly outputArea: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.locator('#userName');
    this.emailInput = page.locator('#userEmail');
    this.currentAddressInput = page.locator('#currentAddress');
    this.permanentAddressInput = page.locator('#permanentAddress');
    this.submitButton = page.locator('#submit');
    this.outputArea = page.locator('#output');
  }

  /**
   * Navigates to the Text Box page.
   */
  async navigate() {
    await this.page.goto('/text-box');
  }

  /**
   * Fills the Text Box form with provided details.
   */
  async fillForm(fullName: string, email: string, currentAddress: string, permanentAddress: string) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.currentAddressInput.fill(currentAddress);
    await this.permanentAddressInput.fill(permanentAddress);
  }

  /**
   * Submits the form. Handles scrolling into view to avoid layout overlay blocks.
   */
  async submit() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  /**
   * Verifies the output matches the submitted values.
   * Note: demoqa has a spelling mistake in output: "Permananet Address :"
   */
  async verifyOutput(expectedName: string, expectedEmail: string, expectedCurrentAddress: string, expectedPermanentAddress: string) {
    await expect(this.outputArea).toBeVisible();
    await expect(this.outputArea.locator('#name')).toContainText(`Name:${expectedName}`);
    await expect(this.outputArea.locator('#email')).toContainText(`Email:${expectedEmail}`);
    await expect(this.outputArea.locator('p#currentAddress')).toContainText(`Current Address :${expectedCurrentAddress}`);
    await expect(this.outputArea.locator('p#permanentAddress')).toContainText(expectedPermanentAddress);
  }
}
