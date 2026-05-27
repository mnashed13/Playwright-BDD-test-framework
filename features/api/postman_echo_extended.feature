@api
Feature: Postman Echo API Extended Coverage

  Scenario: Verify Postman Echo GET request without query parameters
    When I send a GET request to Postman Echo without parameters
    Then the response should contain no query parameters

  Scenario: Verify Postman Echo headers endpoint echoes custom header
    When I send a GET request to Postman Echo headers endpoint with header "x-trace-id" and value "bdd-api-test-123"
    Then the response should contain the echoed header "x-trace-id" with value "bdd-api-test-123"

  Scenario: Verify status endpoint 418 response
    When I send a GET request to Postman Echo status endpoint 418
    Then the response status should be 418
