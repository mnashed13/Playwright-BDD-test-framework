@ui
Feature: Alerts and Dialogs Validation

  As a user of DemoQA,
  I want to trigger different types of browser alerts,
  So that I can verify that alert handling works as expected.

  Scenario: Interact with browser alerts prompts and confirmations
    Given I navigate to the Alerts page
    When I trigger the standard alert
    And I trigger the delayed alert
    And I trigger the confirm box and "accept" the choice
    Then I should see the confirm result text "You selected Ok"
    When I trigger the confirm box and "dismiss" the choice
    Then I should see the confirm result text "You selected Cancel"
    When I trigger the prompt box with text "QA Engineer"
    Then I should see the prompt result text "You entered QA Engineer"
