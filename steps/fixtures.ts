import { test as base } from 'playwright-bdd';
import { TextBoxPage } from '../pages/TextBoxPage.js';
import { ButtonsPage } from '../pages/ButtonsPage.js';
import { WebTablesPage } from '../pages/WebTablesPage.js';
import { PracticeFormPage } from '../pages/PracticeFormPage.js';
import { AlertsPage } from '../pages/AlertsPage.js';
import { EchoApiClient } from '../api/EchoApiClient.js';

type MyFixtures = {
  textBoxPage: TextBoxPage;
  buttonsPage: ButtonsPage;
  webTablesPage: WebTablesPage;
  practiceFormPage: PracticeFormPage;
  alertsPage: AlertsPage;
  echoApiClient: EchoApiClient;
  apiState: { response: any };
};

export const test = base.extend<MyFixtures>({
  page: async ({ page }, use) => {
    // Intercept and check network responses while UI tests are running
    page.on('response', response => {
      const status = response.status();
      if (status >= 400) {
        console.error(`[Network Error Log] ${response.request().method()} ${response.url()} -> Status ${status}`);
      }
    });
    await use(page);
  },
  textBoxPage: async ({ page }, use) => {
    const textBoxPage = new TextBoxPage(page);
    await use(textBoxPage);
  },
  buttonsPage: async ({ page }, use) => {
    const buttonsPage = new ButtonsPage(page);
    await use(buttonsPage);
  },
  webTablesPage: async ({ page }, use) => {
    const webTablesPage = new WebTablesPage(page);
    await use(webTablesPage);
  },
  practiceFormPage: async ({ page }, use) => {
    const practiceFormPage = new PracticeFormPage(page);
    await use(practiceFormPage);
  },
  alertsPage: async ({ page }, use) => {
    const alertsPage = new AlertsPage(page);
    await use(alertsPage);
  },
  echoApiClient: async ({ request }, use) => {
    const echoApiClient = new EchoApiClient(request);
    await use(echoApiClient);
  },
  apiState: async ({}, use) => {
    await use({ response: null });
  },
});
