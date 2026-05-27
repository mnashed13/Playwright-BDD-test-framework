@api
Feature: Postman Echo API Negative Cases

  As a developer or QE engineer,
  I want to test how the API behaves on error responses,
  So that I can ensure proper error handling.

  Scenario: Verify Postman Echo GET request to an invalid endpoint returns 404
    When I send a GET request to an invalid endpoint
    Then the response status should be 404
