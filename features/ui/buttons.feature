@ui
Feature: Buttons Interaction Validation

  As a user of DemoQA,
  I want to interact with various buttons,
  So that I can verify different click actions work correctly.

  Scenario: Successfully click double click, right click and standard buttons
    Given I navigate to the Buttons page
    When I perform a double click action
    Then I should see the double click confirmation message
    When I perform a right click action
    Then I should see the right click confirmation message
    When I perform a dynamic click action
    Then I should see the dynamic click confirmation message
