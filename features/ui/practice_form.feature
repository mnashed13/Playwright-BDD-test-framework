@ui
Feature: Automation Practice Form Validation

  As a user of DemoQA,
  I want to submit the Automation Practice Form,
  So that I can verify the submitted details are displayed inside the submission confirmation.

  Scenario: Successfully submit the Practice Form with complete details
    Given I navigate to the Practice Form page
    When I fill personal details:
      | firstName | lastName | email             | mobile     |
      | Harry     | Potter   | harry@hogwarts.uk | 1234567890 |
    And I select gender "Male"
    And I select date of birth "15" "July" "1999"
    And I select subjects:
      | Maths   |
      | Physics |
    And I select hobbies:
      | Sports |
      | Music  |
    And I fill address "Gryffindor Dormitory" in state "NCR" and city "Delhi"
    And I submit the registration form
    Then I should see the submission confirmation modal with:
      | name         | email             | mobile     |
      | Harry Potter | harry@hogwarts.uk | 1234567890 |
