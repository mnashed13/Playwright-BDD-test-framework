import { Page, Locator, expect } from '@playwright/test';

export class WebTablesPage {
  private readonly page: Page;
  private readonly addButton: Locator;
  private readonly searchInput: Locator;

  // Registration Form fields – scoped inside the modal to avoid ambiguity
  private readonly modal: Locator;
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

    // Scope all form locators inside the modal so they only resolve
    // after the modal is open and avoid stale-element issues.
    this.modal = page.locator('.modal-content');
    this.firstNameInput = this.modal.locator('#firstName');
    this.lastNameInput = this.modal.locator('#lastName');
    this.emailInput = this.modal.locator('#userEmail');
    this.ageInput = this.modal.locator('#age');
    this.salaryInput = this.modal.locator('#salary');
    this.departmentInput = this.modal.locator('#department');
    this.submitButton = this.modal.locator('#submit');
  }

  /**
   * Navigates to the Web Tables page and waits for existing rows to render.
   */
  async navigate() {
    await this.page.goto('/webtables');
    // Wait for at least one table row to ensure the React app has mounted
    await this.page.locator('tbody tr').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Clicks the Add Button to open the registration form modal and waits for it.
   */
  async clickAdd() {
    await this.addButton.click({ force: true });
    // Explicitly wait for modal to be fully visible before proceeding
    await this.modal.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Fills the employee registration form details.
   */
  async fillRegistrationForm(
    first: string,
    last: string,
    email: string,
    age: string,
    salary: string,
    dept: string,
  ) {
    await this.firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.emailInput.fill(email);
    await this.ageInput.fill(age);
    await this.salaryInput.fill(salary);
    await this.departmentInput.fill(dept);
  }

  /**
   * Submits the registration modal form and waits for the modal to close.
   */
  async submitForm() {
    await this.submitButton.click({ force: true });
    // Wait for modal to disappear so the table re-renders with new data
    await this.modal.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Searches the table for a specific query string.
   */
  async searchRecord(query: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(query);
    // Brief pause to let the table filter re-render
    await this.page.waitForTimeout(500);
  }

  /**
   * Verifies that a record with the specific email exists and displays correct data.
   */
  async verifyRecordInTable(email: string, expectedFirstName: string) {
    const row = this.page.locator('tbody tr').filter({ hasText: email });
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(expectedFirstName);
  }

  /**
   * Clicks the Edit action icon for a row identified by its email,
   * then waits for the edit modal to open.
   */
  async clickEditForRecord(email: string) {
    const row = this.page.locator('tbody tr').filter({ hasText: email });
    await row.locator('span[title="Edit"]').click({ force: true });
    await this.modal.waitFor({ state: 'visible', timeout: 10000 });
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
    await expect(row).not.toBeVisible({ timeout: 10000 });
  }
}
