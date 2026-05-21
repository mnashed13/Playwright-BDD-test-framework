import { createBdd } from 'playwright-bdd';
import { test } from './fixtures.js';

const { Given, When, Then } = createBdd(test);

Given('I navigate to the Text Box page', async ({ textBoxPage }) => {
  await textBoxPage.navigate();
});

When('I fill the form with details:', async ({ textBoxPage }, dataTable) => {
  const row = dataTable.hashes()[0];
  await textBoxPage.fillForm(
    row.fullName,
    row.email,
    row.currentAddress,
    row.permanentAddress
  );
});

When('I submit the form', async ({ textBoxPage }) => {
  await textBoxPage.submit();
});

Then('I should see the output matching the submitted details:', async ({ textBoxPage }, dataTable) => {
  const row = dataTable.hashes()[0];
  await textBoxPage.verifyOutput(
    row.fullName,
    row.email,
    row.currentAddress,
    row.permanentAddress
  );
});
