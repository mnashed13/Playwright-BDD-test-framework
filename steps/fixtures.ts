import { test as base } from 'playwright-bdd';
import { TextBoxPage } from '../pages/TextBoxPage.js';
import { EchoApiClient } from '../api/EchoApiClient.js';

type MyFixtures = {
  textBoxPage: TextBoxPage;
  echoApiClient: EchoApiClient;
  apiState: { response: any };
};

export const test = base.extend<MyFixtures>({
  textBoxPage: async ({ page }, use) => {
    const textBoxPage = new TextBoxPage(page);
    await use(textBoxPage);
  },
  echoApiClient: async ({ request }, use) => {
    const echoApiClient = new EchoApiClient(request);
    await use(echoApiClient);
  },
  apiState: async ({}, use) => {
    await use({ response: null });
  },
});
