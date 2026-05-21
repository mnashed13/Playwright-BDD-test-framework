@api
Feature: Postman Echo API Validation

  As a developer or QE engineer,
  I want to interact with the Postman Echo API,
  So that I can verify GET and POST HTTP endpoints work correctly.

  Scenario: Verify Postman Echo GET request with query parameters
    When I send a GET request to Postman Echo with parameters:
      | foo1 | bar1 |
      | foo2 | bar2 |
    Then the response should contain the query parameters:
      | foo1 | bar1 |
      | foo2 | bar2 |

  Scenario: Verify Postman Echo POST request with JSON payload
    When I send a POST request to Postman Echo with payload:
      | name | John   |
      | job  | Leader |
    Then the response should contain the payload data:
      | name | John   |
      | job  | Leader |
