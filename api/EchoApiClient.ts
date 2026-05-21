import { APIRequestContext, expect } from '@playwright/test';

export class EchoApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrl = 'https://postman-echo.com';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Sends a GET request to Postman Echo with custom query parameters.
   */
  async sendGetRequest(queryParams: Record<string, string>) {
    const searchParams = new URLSearchParams(queryParams);
    const response = await this.request.get(`${this.baseUrl}/get?${searchParams.toString()}`);
    expect(response.status()).toBe(200);
    return await response.json();
  }

  /**
   * Sends a POST request to Postman Echo with a JSON payload.
   */
  async sendPostRequest(payload: any) {
    const response = await this.request.post(`${this.baseUrl}/post`, {
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(response.status()).toBe(200);
    return await response.json();
  }

  /**
   * Asserts that the response from the GET request matches expected query parameters.
   */
  async verifyGetResponse(responseBody: any, expectedParams: Record<string, string>) {
    expect(responseBody).toBeDefined();
    expect(responseBody.args).toBeDefined();
    for (const [key, value] of Object.entries(expectedParams)) {
      expect(responseBody.args[key]).toBe(value);
    }
  }

  /**
   * Asserts that the response from the POST request matches the submitted payload.
   */
  async verifyPostResponse(responseBody: any, expectedPayload: any) {
    expect(responseBody).toBeDefined();
    const data = responseBody.json || responseBody.data;
    expect(data).toBeDefined();
    for (const [key, value] of Object.entries(expectedPayload)) {
      expect(data[key]).toBe(value);
    }
  }
}
