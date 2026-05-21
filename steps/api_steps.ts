import { createBdd } from 'playwright-bdd';
import { test } from './fixtures.js';

const { When, Then } = createBdd(test);

When('I send a GET request to Postman Echo with parameters:', async ({ echoApiClient, apiState }, dataTable) => {
  const queryParams = dataTable.rowsHash();
  apiState.response = await echoApiClient.sendGetRequest(queryParams);
});

Then('the response should contain the query parameters:', async ({ echoApiClient, apiState }, dataTable) => {
  const expectedParams = dataTable.rowsHash();
  await echoApiClient.verifyGetResponse(apiState.response, expectedParams);
});

When('I send a POST request to Postman Echo with payload:', async ({ echoApiClient, apiState }, dataTable) => {
  const payload = dataTable.rowsHash();
  apiState.response = await echoApiClient.sendPostRequest(payload);
});

Then('the response should contain the payload data:', async ({ echoApiClient, apiState }, dataTable) => {
  const expectedPayload = dataTable.rowsHash();
  await echoApiClient.verifyPostResponse(apiState.response, expectedPayload);
});
