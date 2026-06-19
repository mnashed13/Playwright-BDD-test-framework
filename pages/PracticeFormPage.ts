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
   * Navigates to the Practice Form page and dismisses any cookie/ad banners.
   */
  async navigate() {
    await this.page.goto('/automation-practice-form');
    // Dismiss any fixed ad overlays that block clicks by removing them from the DOM
    await this.page.evaluate(() => {
      document.querySelectorAll(
        '#fixedban, .ad-banner, [id*="google_ads"], [class*="ad-"], iframe[id*="google_ads"]',
      ).forEach(el => el.remove());
    });
  }

  /**
   * Fills out personal details.
   */
  async fillPersonalDetails(
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.mobileInput.fill(mobile);
  }

  /**
   * Selects gender via its label. Uses the exact for= attribute to avoid
   * picking up unrelated labels that share the same text (e.g. hobby labels).
   */
  async selectGender(gender: string) {
    // Map gender text to the known input id on demoqa
    const genderMap: Record<string, string> = {
      Male: 'gender-radio-1',
      Female: 'gender-radio-2',
      Other: 'gender-radio-3',
    };
    const labelFor = genderMap[gender];
    if (!labelFor) throw new Error(`Unknown gender: ${gender}`);
    await this.page.locator(`label[for="${labelFor}"]`).click({ force: true });
  }

  /**
   * Configures Date of Birth using the calendar widget.
   */
  async setDateOfBirth(day: string, month: string, year: string) {
    await this.dateOfBirthInput.click();
    await this.page.locator('.react-datepicker__month-select').selectOption({ label: month });
    await this.page.locator('.react-datepicker__year-select').selectOption(year);
    // react-datepicker uses zero-padded 3-char class names e.g. --015
    const paddedDay = day.padStart(3, '0');
    await this.page
      .locator(`.react-datepicker__day--${paddedDay}:not(.react-datepicker__day--outside-month)`)
      .first()
      .click();
  }

  /**
   * Enters subjects into the React-Select autocomplete.
   * Uses pressSequentially to trigger internal event listeners, then clicks
   * the first visible dropdown option.
   */
  async enterSubjects(subjects: string[]) {
    for (const subject of subjects) {
      await this.subjectsInput.click();
      await this.subjectsInput.pressSequentially(subject, { delay: 80 });
      // React-Select renders options in a menu; wait for any option to appear
      const option = this.page
        .locator('.subjects-auto-complete__menu .subjects-auto-complete__option')
        .first();
      await option.waitFor({ state: 'visible', timeout: 8000 });
      await option.click();
    }
  }

  /**
   * Selects hobbies by their exact label[for=] attribute to avoid
   * intercepted-click issues caused by ad overlays or other labels.
   */
  async selectHobbies(hobbies: string[]) {
    const hobbyMap: Record<string, string> = {
      Sports: 'hobbies-checkbox-1',
      Reading: 'hobbies-checkbox-2',
      Music: 'hobbies-checkbox-3',
    };
    for (const hobby of hobbies) {
      const labelFor = hobbyMap[hobby];
      if (!labelFor) throw new Error(`Unknown hobby: ${hobby}`);
      await this.page.locator(`label[for="${labelFor}"]`).click({ force: true });
    }
  }

  /**
   * Fills address details and selects State + City from their React-Select dropdowns.
   */
  async fillAddress(address: string, state: string, city: string) {
    await this.currentAddressInput.fill(address);

    // State dropdown
    await this.page.locator('#state input').fill(state);
    const stateOption = this.page
      .locator('#state .css-26l3qy-menu div, #react-select-3-option-0, [id^="react-select-3-option"]')
      .first();
    // Fallback: just press Enter if the option selector is unreliable
    try {
      await stateOption.waitFor({ state: 'visible', timeout: 4000 });
      await stateOption.click();
    } catch {
      await this.page.locator('#state input').press('Enter');
    }

    // City dropdown (only available after state is selected)
    await this.page.locator('#city input').waitFor({ state: 'visible', timeout: 5000 });
    await this.page.locator('#city input').fill(city);
    const cityOption = this.page
      .locator('#city .css-26l3qy-menu div, [id^="react-select-4-option"]')
      .first();
    try {
      await cityOption.waitFor({ state: 'visible', timeout: 4000 });
      await cityOption.click();
    } catch {
      await this.page.locator('#city input').press('Enter');
    }
  }

  /**
   * Submits the practice form.
   * Strategy: remove ALL fixed/overlay elements that can intercept the click,
   * scroll to the bottom of the page so the button is in the viewport,
   * then use a direct JS click() to bypass any remaining pointer-event blocks.
   */
  async submit() {
    // Step 1: Remove every iframe, fixed banner, and ad overlay on the page
    await this.page.evaluate(() => {
      document.querySelectorAll(
        'iframe, #fixedban, [id*="google_ads"], [id*="ad_"], [class*="ad-"], [class*="adsbygoogle"], div[style*="position: fixed"]',
      ).forEach(el => el.remove());
    });

    // Step 2: Scroll to the very bottom so the submit button is in view
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(300);

    // Step 3: Scroll the button itself into view for good measure
    await this.submitButton.scrollIntoViewIfNeeded();

    // Step 4: Use JS click() directly — bypasses all pointer-event interception
    await this.page.evaluate(() => {
      const btn = document.querySelector<HTMLElement>('#submit');
      if (btn) btn.click();
    });
  }

  /**
   * Verifies the submission confirmation modal title and contains the key fields.
   * Uses a longer timeout to account for CI network/render lag.
   */
  async verifySubmissionSuccess(
    expectedName: string,
    expectedEmail: string,
    expectedMobile: string,
  ) {
    await expect(this.modalContent).toBeVisible({ timeout: 15000 });
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
