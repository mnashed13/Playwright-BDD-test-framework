@ui
Feature: Web Tables CRUD Validation

  As a QE engineer,
  I want to perform CRUD operations on the Web Tables component,
  So that I can verify adding, searching, editing, and deleting records works.

  Scenario: Add search edit and delete employee records
    Given I navigate to the Web Tables page
    When I click the Add button
    And I submit the registration form with details:
      | firstName | lastName | email            | age | salary | department |
      | Sarah     | Connor   | sarah@skynet.com | 35  | 95000  | Security   |
    Then I should see the employee with email "sarah@skynet.com" display first name "Sarah" in the table
    
    When I search the table for "sarah@skynet.com"
    And I click the Edit button for record with email "sarah@skynet.com"
    And I submit the registration form with details:
      | firstName | lastName | email            | age | salary | department |
      | Sarah     | Connor   | sarah@skynet.com | 36  | 110000 | Operations |
    Then I should see the employee with email "sarah@skynet.com" display first name "Sarah" in the table

    When I click the Delete button for record with email "sarah@skynet.com"
    And I search the table for "sarah@skynet.com"
    Then I should verify the record with email "sarah@skynet.com" is deleted
