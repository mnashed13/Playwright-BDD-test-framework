import { createBdd } from 'playwright-bdd';
import { test } from './fixtures.js';

const { Given, When, Then } = createBdd(test);

// ==========================================
// 1. Text Box Steps
// ==========================================

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

// ==========================================
// 2. Buttons Steps
// ==========================================

Given('I navigate to the Buttons page', async ({ buttonsPage }) => {
  await buttonsPage.navigate();
});

When('I perform a double click action', async ({ buttonsPage }) => {
  await buttonsPage.performDoubleClick();
});

Then('I should see the double click confirmation message', async ({ buttonsPage }) => {
  await buttonsPage.verifyDoubleClickMessage();
});

When('I perform a right click action', async ({ buttonsPage }) => {
  await buttonsPage.performRightClick();
});

Then('I should see the right click confirmation message', async ({ buttonsPage }) => {
  await buttonsPage.verifyRightClickMessage();
});

When('I perform a dynamic click action', async ({ buttonsPage }) => {
  await buttonsPage.performDynamicClick();
});

Then('I should see the dynamic click confirmation message', async ({ buttonsPage }) => {
  await buttonsPage.verifyDynamicClickMessage();
});

// ==========================================
// 3. Web Tables Steps
// ==========================================

Given('I navigate to the Web Tables page', async ({ webTablesPage }) => {
  await webTablesPage.navigate();
});

When('I click the Add button', async ({ webTablesPage }) => {
  await webTablesPage.clickAdd();
});

When('I submit the registration form with details:', async ({ webTablesPage }, dataTable) => {
  const row = dataTable.hashes()[0];
  await webTablesPage.fillRegistrationForm(
    row.firstName,
    row.lastName,
    row.email,
    row.age,
    row.salary,
    row.department
  );
  await webTablesPage.submitForm();
});

Then('I should see the employee with email {string} display first name {string} in the table', async ({ webTablesPage }, email, firstName) => {
  await webTablesPage.verifyRecordInTable(email, firstName);
});

When('I search the table for {string}', async ({ webTablesPage }, query) => {
  await webTablesPage.searchRecord(query);
});

When('I click the Edit button for record with email {string}', async ({ webTablesPage }, email) => {
  await webTablesPage.clickEditForRecord(email);
});

When('I click the Delete button for record with email {string}', async ({ webTablesPage }, email) => {
  await webTablesPage.clickDeleteForRecord(email);
});

Then('I should verify the record with email {string} is deleted', async ({ webTablesPage }, email) => {
  await webTablesPage.verifyRecordDeleted(email);
});

// ==========================================
// 4. Practice Form Steps
// ==========================================

Given('I navigate to the Practice Form page', async ({ practiceFormPage }) => {
  await practiceFormPage.navigate();
});

When('I fill personal details:', async ({ practiceFormPage }, dataTable) => {
  const row = dataTable.hashes()[0];
  await practiceFormPage.fillPersonalDetails(
    row.firstName,
    row.lastName,
    row.email,
    row.mobile
  );
});

When('I select gender {string}', async ({ practiceFormPage }, gender) => {
  await practiceFormPage.selectGender(gender);
});

When('I select date of birth {string} {string} {string}', async ({ practiceFormPage }, day, month, year) => {
  await practiceFormPage.setDateOfBirth(day, month, year);
});

When('I select subjects:', async ({ practiceFormPage }, dataTable) => {
  // Extract subjects as array of strings
  const subjects = dataTable.raw().map(row => row[0]);
  await practiceFormPage.enterSubjects(subjects);
});

When('I select hobbies:', async ({ practiceFormPage }, dataTable) => {
  // Extract hobbies as array of strings
  const hobbies = dataTable.raw().map(row => row[0]);
  await practiceFormPage.selectHobbies(hobbies);
});

When('I fill address {string} in state {string} and city {string}', async ({ practiceFormPage }, address, state, city) => {
  await practiceFormPage.fillAddress(address, state, city);
});

When('I submit the registration form', async ({ practiceFormPage }) => {
  await practiceFormPage.submit();
});

Then('I should see the submission confirmation modal with:', async ({ practiceFormPage }, dataTable) => {
  const row = dataTable.hashes()[0];
  await practiceFormPage.verifySubmissionSuccess(
    row.name,
    row.email,
    row.mobile
  );
});

// ==========================================
// 5. Alerts Steps
// ==========================================

Given('I navigate to the Alerts page', async ({ alertsPage }) => {
  await alertsPage.navigate();
});

When('I trigger the standard alert', async ({ alertsPage }) => {
  await alertsPage.triggerAlert();
});

When('I trigger the delayed alert', async ({ alertsPage }) => {
  await alertsPage.triggerTimerAlert();
});

When('I trigger the confirm box and {string} the choice', async ({ alertsPage }, action) => {
  const accept = action.toLowerCase() === 'accept';
  await alertsPage.triggerConfirm(accept);
});

Then('I should see the confirm result text {string}', async ({ alertsPage }, expectedText) => {
  await alertsPage.verifyConfirmResult(expectedText);
});

When('I trigger the prompt box with text {string}', async ({ alertsPage }, text) => {
  await alertsPage.triggerPrompt(text);
});

Then('I should see the prompt result text {string}', async ({ alertsPage }, expectedText) => {
  await alertsPage.verifyPromptResult(expectedText);
});
