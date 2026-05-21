@ui
Feature: Text Box Form Validation

  As a user of DemoQA,
  I want to fill out the Text Box form,
  So that I can see the submitted details displayed below the form.

  Scenario: Successfully submit the Text Box form with valid details
    Given I navigate to the Text Box page
    When I fill the form with details:
      | fullName | email            | currentAddress   | permanentAddress |
      | John Doe | john@example.com | 123 Main St, NY  | 456 Elm St, CA   |
    And I submit the form
    Then I should see the output matching the submitted details:
      | fullName | email            | currentAddress   | permanentAddress |
      | John Doe | john@example.com | 123 Main St, NY  | 456 Elm St, CA   |
