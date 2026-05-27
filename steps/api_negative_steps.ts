import { createBdd } from 'playwright-bdd';
import { test } from './fixtures.js';
import { expect } from '@playwright/test';

const { When, Then } = createBdd(test);

When('I send a GET request to an invalid endpoint', async ({ request, apiState }) => {
  const response = await request.get('https://postman-echo.com/status/404');
  apiState.response = response;
});

Then('the response status should be {int}', async ({ apiState }, expectedStatus) => {
  expect(apiState.response.status()).toBe(expectedStatus);
});
