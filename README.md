# Playwright BDD Test Framework

A premium, state-of-the-art QE test framework combining **Playwright** and **Cucumber Gherkin BDD** in a seamless **TypeScript** codebase. Optimized for developer-experience, rapid test execution, cross-browser cloud testing via **BrowserStack**, and robust CI/CD execution via **GitHub Actions**.

---

## 🚀 Key Features

* **Native Playwright Runner Speed**: Uses `playwright-bdd` to compile Gherkin `.feature` files into native Playwright test suites. You get 100% of Playwright's parallelization, performance, HTML reports, and debugging tools.
* **QE-Centric Page Object Model (POM)**: Resilient selectors and actions wrapped inside reusable components for excellent code maintainability.
* **Separation of Concerns**: Isolated directories for E2E UI tests and HTTP API tests.
* **Dependency-Injected Fixtures**: Automatic page objects and API client injection using standard Playwright fixtures.
* **Cross-Browser & Cloud Ready**: Fully integrated with BrowserStack for running cross-platform/browser matrices.
* **Continuous Integration**: Pre-configured GitHub Actions pipeline with automated browser provisioning and test reports uploads.

---

## 📁 Project Structure

```
playwright-bdd-test-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI workflow
├── api/
│   └── EchoApiClient.ts          # API Client class for Postman Echo
├── features/
│   ├── ui/
│   │   └── textbox.feature        # BDD Feature for demoqa.com Text Box
│   └── api/
│       └── postman_echo.feature   # BDD Feature for Postman Echo API
├── pages/
│   └── TextBoxPage.ts            # Page Object Model for Text Box UI
├── steps/
│   ├── fixtures.ts                # Playwright BDD custom fixtures setup
│   ├── ui_steps.ts               # UI Step Definitions
│   └── api_steps.ts              # API Step Definitions
├── .gitignore                    # Standard Git ignore rules
├── browserstack.yml              # BrowserStack cross-browser config
├── package.json                  # Script definitions & npm packages
├── playwright.config.ts          # Playwright and Playwright-BDD config
└── tsconfig.json                 # TypeScript compilation settings
```

---

## 🛠️ Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* NPM (included with Node.js)

---

## ⚙️ Setup and Installation

1. **Clone & Navigate to the project:**
   ```bash
   cd playwright-BDD-test-framework
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright Browsers (Chromium, Firefox, WebKit):**
   ```bash
   npx playwright install
   ```

---

## 🏃 Running Tests

All execution commands automatically compile the Gherkin feature files into TypeScript executable specs prior to running:

### 1. Run the entire suite (UI + API across Chromium, Firefox, WebKit)
```bash
npm run test
```

### 2. Run only E2E UI Tests
```bash
npm run test:ui
```

### 3. Run only API Tests
```bash
npm run test:api
```

### 4. Run tests with a headed browser
```bash
npm run test:headed
```

### 5. Debug tests using the Playwright Inspector
```bash
npm run test:debug
```

---

## 🔗 BrowserStack Integration

To execute tests across different browsers, mobile devices, and OS versions in the cloud:

1. Obtain your **Username** and **Access Key** from your [BrowserStack Dashboard](https://live.browserstack.com/).
2. Set them as environment variables:
   ```bash
   export BROWSERSTACK_USERNAME="your_username"
   export BROWSERSTACK_ACCESS_KEY="your_access_key"
   ```
3. Run BrowserStack tests:
   ```bash
   # Make sure browserstack-playwright-cli is installed or run with BrowserStack runner
   npx browserstack-playwright run
   ```

You can customize browser and device targeting by editing `browserstack.yml`.

---

## 🤖 GitHub Actions Workflow

When pushing or making pull requests to `main` or `master` branches, the `.github/workflows/playwright.yml` workflow automatically runs:
1. Provisions an Ubuntu Runner.
2. Checks out code and restores Node modules cache.
3. Installs project dependencies.
4. Downloads Playwright browsers and dependencies.
5. Performs Gherkin-to-Playwright compilation and runs the test suite.
6. Uploads the HTML report artifact as a zip package on both success and failure.

---

## 📝 How to Add New Tests

### Adding a UI Test:
1. **Create a `.feature` file** inside `features/ui/` using `@ui` tags.
2. **Define a Page Object Model (POM)** class inside `pages/` that contains element locators and page interaction helper methods.
3. **Register the POM** inside `steps/fixtures.ts` to automatically inject it as a Playwright fixture.
4. **Write Step Definitions** inside `steps/ui_steps.ts` implementing the step statements and calling the POM methods.

### Adding an API Test:
1. **Create a `.feature` file** inside `features/api/` using `@api` tags.
2. Add API endpoint helper methods inside `api/EchoApiClient.ts` (or create a new client helper).

## 📦 Built With

- **Playwright** – Browser automation library.
- **Cucumber BDD** – Gherkin syntax for behavior-driven development.
- **TypeScript** – Typed superset of JavaScript.
- **BrowserStack** – Cross‑browser cloud testing.
- **GitHub Actions** – CI/CD pipeline.

## 🏗️ Architecture Overview

The framework follows a clean separation of concerns:

```
features/
  └── *.feature   ← Gherkin specifications
pages/
  └── *.ts        ← Page Object Model classes
steps/
  └── *.ts        ← Step definitions & fixtures
api/
  └── *.ts        ← API client helpers
```

Playwright‑BDD compiles the `.feature` files into native Playwright test suites, injects the page‑object fixtures, and executes them in parallel across browsers.

## 🙋‍♂️ Contributing

Contributions are welcome! Please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b my‑feature`).
3. Write tests for your changes.
4. Run the full test suite (`npm run test`).
5. Open a Pull Request with a clear description.

## 📜 License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

## ❓ FAQ

**Q:** How do I run tests on a specific browser?
**A:** Use the `--project` flag, e.g. `npx playwright test --project=chromium`.

**Q:** Where are the test reports stored?
**A:** HTML reports are generated in `playwright-report/` after each run.

3. **Write Step Definitions** inside `steps/api_steps.ts` mapping HTTP parameters, payloads, and validating response schemas.
## 🚀 Project Roadmap

- **v1.1**: Add support for visual regression testing.
- **v1.2**: Integrate with Cypress for hybrid testing.
- **v2.0**: Provide a CLI wizard for project scaffolding.
- **v2.1**: Add community plugin system for custom fixtures.
- **Future**: Explore AI‑generated test suggestions using Gemini.
