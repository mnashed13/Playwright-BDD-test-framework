import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from './fixtures.js';

const { When, Then } = createBdd(test);

When('I send a GET request to Postman Echo without parameters', async ({ echoApiClient, apiState }) => {
  apiState.response = await echoApiClient.sendGetRequest({});
});

Then('the response should contain no query parameters', async ({ apiState }) => {
  expect(apiState.response).toBeDefined();
  expect(apiState.response.args).toEqual({});
});

When(
  'I send a GET request to Postman Echo headers endpoint with header {string} and value {string}',
  async ({ request, apiState }, headerName: string, headerValue: string) => {
    apiState.response = await request.get('https://postman-echo.com/headers', {
      headers: {
        [headerName]: headerValue,
      },
    });
  }
);

Then(
  'the response should contain the echoed header {string} with value {string}',
  async ({ apiState }, headerName: string, expectedValue: string) => {
    const responseBody = await apiState.response.json();
    const responseHeaders = (responseBody.headers ?? {}) as Record<string, string>;
    expect(responseHeaders[headerName.toLowerCase()]).toBe(expectedValue);
  }
);

When('I send a GET request to Postman Echo status endpoint {int}', async ({ request, apiState }, statusCode: number) => {
  apiState.response = await request.get(`https://postman-echo.com/status/${statusCode}`);
});
