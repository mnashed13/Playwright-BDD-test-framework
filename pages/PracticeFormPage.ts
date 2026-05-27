import { Page, Locator, expect } from '@playwright/test';

export class PracticeFormPage {
  private readonly page: Page;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly mobileInput: Locator;
  private readonly dateOfBirthInput: Locator;
  private readonly subjectsInput: Locator;
  private readonly currentAddressInput: Locator;
  private readonly submitButton: Locator;
  
  // Modal selectors
  private readonly modalContent: Locator;
  private readonly modalTitle: Locator;
  private readonly closeModalButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.mobileInput = page.locator('#userNumber');
    this.dateOfBirthInput = page.locator('#dateOfBirthInput');
    this.subjectsInput = page.locator('#subjectsInput');
    this.currentAddressInput = page.locator('#currentAddress');
    this.submitButton = page.locator('#submit');
    
    this.modalContent = page.locator('.modal-content');
    this.modalTitle = page.locator('#example-modal-sizes-title-lg');
    this.closeModalButton = page.locator('#closeLargeModal');
  }

  /**
   * Navigates to the Practice Form page.
   */
  async navigate() {
    await this.page.goto('/automation-practice-form');
  }

  /**
   * Fills out personal details.
   */
  async fillPersonalDetails(firstName: string, lastName: string, email: string, mobile: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.mobileInput.fill(mobile);
  }

  /**
   * Selects gender. The raw radio button is hidden, so we click its label.
   */
  async selectGender(gender: string) {
    await this.page.locator(`label:has-text("${gender}")`).first().click();
  }

  /**
   * Configures Date of Birth using the calendar widget.
   */
  async setDateOfBirth(day: string, month: string, year: string) {
    await this.dateOfBirthInput.click();
    await this.page.locator('.react-datepicker__month-select').selectOption({ label: month });
    await this.page.locator('.react-datepicker__year-select').selectOption(year);
    // Pads "5" into "005" for react-datepicker selector format
    const paddedDay = day.padStart(3, '0');
    // Click the day matching the class name
    await this.page.locator(`.react-datepicker__day--${paddedDay}:not(.react-datepicker__day--outside-month)`).first().click();
  }

  /**
   * Enters and submits subject autocomplete.
   */
  async enterSubjects(subjects: string[]) {
    for (const subject of subjects) {
      await this.subjectsInput.click();
      await this.subjectsInput.pressSequentially(subject, { delay: 100 });
      // Wait for the autocomplete option to be visible and click it
      const option = this.page.locator('div[class*="-option"], .subjects-auto-complete__option, div[id^="react-select-"]').first();
      await option.waitFor({ state: 'visible', timeout: 5000 });
      await option.click();
    }
  }

  /**
   * Selects hobbies. Click label directly.
   */
  async selectHobbies(hobbies: string[]) {
    for (const hobby of hobbies) {
      await this.page.locator(`label:has-text("${hobby}")`).first().click();
    }
  }

  /**
   * Enters address details.
   */
  async fillAddress(address: string, state: string, city: string) {
    await this.currentAddressInput.fill(address);
    
    // Select State using search-input and Enter
    await this.page.locator('#state input').fill(state);
    await this.page.locator('#state input').press('Enter');
    
    // Select City using search-input and Enter
    await this.page.locator('#city input').fill(city);
    await this.page.locator('#city input').press('Enter');
  }

  /**
   * Submits the practice form.
   */
  async submit() {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click({ force: true }); // force click in case of footer overlapping
  }

  /**
   * Verifies the submission confirmation modal title and contains the key fields.
   */
  async verifySubmissionSuccess(expectedName: string, expectedEmail: string, expectedMobile: string) {
    await expect(this.modalContent).toBeVisible();
    await expect(this.modalTitle).toHaveText('Thanks for submitting the form');
    await expect(this.modalContent).toContainText(expectedName);
    await expect(this.modalContent).toContainText(expectedEmail);
    await expect(this.modalContent).toContainText(expectedMobile);
  }

  /**
   * Closes the success modal.
   */
  async closeModal() {
    await this.closeModalButton.click();
    await expect(this.modalContent).not.toBeVisible();
  }
}
