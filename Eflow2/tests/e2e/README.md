# E2E Testing Setup Guide

This guide explains how to set up and run end-to-end tests for the Eflow2 form builder application using Playwright.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- The Eflow2 application

## Installation

### 1. Install Playwright

```bash
npm install -D @playwright/test
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

For installing browsers for specific projects only:

```bash
# Install only Chromium
npx playwright install chromium

# Install all browsers
npx playwright install --all
```

### 3. Verify Installation

```bash
npx playwright --version
```

## Configuration

The Playwright configuration is defined in `playwright.config.ts` at the project root.

### Environment Variables

Create a `.env` file in the project root (optional):

```env
# Base URL for the application
BASE_URL=http://localhost:3003

# For CI environments
CI=true
```

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/eventExecution.spec.ts
```

### Run Tests in UI Mode

```bash
npx playwright test --ui
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Tests for Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests Headed (Show Browser Window)

```bash
npx playwright test --headed
```

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

The report includes:
- Test results and duration
- Screenshots of failures
- Video recordings
- Trace files for debugging

## Test Structure

The E2E tests are located in `tests/e2e/eventExecution.spec.ts` and cover:

### Main Test Suites

1. **Event Execution E2E Tests**
   - Complete workflow: create form → configure events → preview → verify execution
   - Complex validation logic
   - Error handling
   - Security (dangerous code prevention)
   - Multiple events on same component
   - Data transformation
   - Form submission validation

2. **Performance Tests**
   - Rapid event triggering
   - Event execution efficiency

3. **Accessibility Tests**
   - Keyboard navigation
   - Screen reader compatibility

### Helper Functions

The test file includes reusable helper functions:
- `goToHomePage()` - Navigate to home page
- `createNewForm()` - Create a new form
- `dragComponentToCanvas()` - Drag components to canvas
- `selectNode()` - Select a component node
- `configureEventHandler()` - Configure event handlers
- `saveForm()` - Save the form
- `goToPreview()` - Enter preview mode
- `triggerEvent()` - Trigger events on form fields
- `verifyFormDataValue()` - Verify form data values

## Writing New Tests

### Basic Test Example

```typescript
import { test, expect } from '@playwright/test'

test('my test description', async ({ page }) => {
  // Navigate to page
  await page.goto('http://localhost:3003')

  // Interact with elements
  await page.click('button:has-text("Click me")')

  // Assert results
  await expect(page.locator('.success-message')).toBeVisible()
})
```

### Using Page Objects

For complex tests, consider using Page Object Model:

```typescript
class FormEditorPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:3003/editor')
  }

  async addComponent(type: string) {
    await this.page.click(`[data-testid="component-${type}"]`)
  }
}

test('using page object', async ({ page }) => {
  const editorPage = new FormEditorPage(page)
  await editorPage.goto()
  await editorPage.addComponent('Input')
})
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Troubleshooting

### Tests Fail to Connect to Server

Ensure the development server is running:

```bash
npm run dev
```

Or use the `webServer` config in `playwright.config.ts` to auto-start the server.

### Tests Timeout

Increase timeout in `playwright.config.ts`:

```typescript
timeout: 60 * 1000, // 60 seconds
```

Or for specific tests:

```typescript
test.setTimeout(60000)
```

### Flaky Tests

Add retries in `playwright.config.ts`:

```typescript
retries: 3
```

### Browser Installation Issues

```bash
# Force reinstall
npx playwright install --force

# Install system dependencies (Ubuntu/Debian)
npx playwright install-deps
```

## Best Practices

1. **Use Data Attributes**: Add `data-testid` attributes to elements for reliable selection
2. **Avoid Brittle Selectors**: Prefer `data-testid` over CSS classes or text content
3. **Wait for Network**: Use `page.waitForLoadState('networkidle')` after navigation
4. **Clean Up**: Ensure tests clean up created data
5. **Isolation**: Each test should be independent
6. **Realistic Scenarios**: Test actual user workflows, not just technical details
7. **Error Messages**: Verify user-friendly error messages are displayed
8. **Accessibility**: Include keyboard navigation tests

## Example Test Workflow

```typescript
test('complete user journey', async ({ page }) => {
  // 1. Navigate to application
  await page.goto('/')

  // 2. Create new form
  await page.click('button:has-text("Create Form")')
  await page.fill('input[name="title"]', 'My Test Form')
  await page.click('button:has-text("Save")')

  // 3. Add components
  await page.dragAndDrop('#input-component', '#canvas')
  await page.click('.canvas-node')
  await page.fill('input[name="label"]', 'Username')

  // 4. Configure events
  await page.click('tab:has-text("Events")')
  await page.selectOption('select[name="eventType"]', 'blur')
  await page.fill('textarea[name="eventCode"]', 'console.log("test")')
  await page.click('button:has-text("Save Event")')

  // 5. Preview and test
  await page.click('button:has-text("Preview")')
  await page.fill('input[placeholder="Username"]', 'testuser')
  await page.blur()

  // 6. Verify results
  await expect(page.locator('.data-display')).toContainText('testuser')
})
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Eflow2 Documentation](./docs/)

## Support

For issues or questions about E2E testing:
1. Check the Playwright documentation
2. Review existing test files for examples
3. Check browser console and network logs
4. Use `--debug` flag to step through tests
