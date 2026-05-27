import { Page, Locator, expect } from '@playwright/test';

export class WebTablesPage {
  private readonly page: Page;
  private readonly addButton: Locator;
  private readonly searchInput: Locator;
  
  // Registration Form fields
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly ageInput: Locator;
  private readonly salaryInput: Locator;
  private readonly departmentInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('#addNewRecordButton');
    this.searchInput = page.locator('#searchBox');
    
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.ageInput = page.locator('#age');
    this.salaryInput = page.locator('#salary');
    this.departmentInput = page.locator('#department');
    this.submitButton = page.locator('#submit');
  }

  /**
   * Navigates to the Web Tables page.
   */
  async navigate() {
    await this.page.goto('/webtables');
  }

  /**
   * Clicks the Add Button to open the registration form modal.
   */
  async clickAdd() {
    await this.addButton.click({ force: true });
  }

  /**
   * Fills the employee registration form details.
   */
  async fillRegistrationForm(first: string, last: string, email: string, age: string, salary: string, dept: string) {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.emailInput.fill(email);
    await this.ageInput.fill(age);
    await this.salaryInput.fill(salary);
    await this.departmentInput.fill(dept);
  }

  /**
   * Submits the registration modal form.
   */
  async submitForm() {
    await this.submitButton.click({ force: true });
  }

  /**
   * Searches the table for a specific query string.
   */
  async searchRecord(query: string) {
    await this.searchInput.fill(query);
  }

  /**
   * Verifies that a record with the specific email exists and displays correct data.
   */
  async verifyRecordInTable(email: string, expectedFirstName: string) {
    const row = this.page.locator('tbody tr').filter({ hasText: email });
    await expect(row).toBeVisible();
    await expect(row).toContainText(expectedFirstName);
  }

  /**
   * Clicks the Edit action icon for a row identified by its email.
   */
  async clickEditForRecord(email: string) {
    const row = this.page.locator('tbody tr').filter({ hasText: email });
    await row.locator('span[title="Edit"]').click({ force: true });
  }

  /**
   * Clicks the Delete action icon for a row identified by its email.
   */
  async clickDeleteForRecord(email: string) {
    const row = this.page.locator('tbody tr').filter({ hasText: email });
    await row.locator('span[title="Delete"]').click({ force: true });
  }

  /**
   * Asserts that a record with the specific email is no longer displayed.
   */
  async verifyRecordDeleted(email: string) {
    const row = this.page.locator('tbody tr').filter({ hasText: email });
    // In demoqa webtable, when searching for non-existing query, rows become invisible or table contains no matches.
    // Let's assert that there is no visible row containing this text.
    await expect(row).not.toBeVisible();
  }
}
