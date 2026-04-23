/**
 * E2E Tests for Event Execution Functionality
 *
 * This test suite validates end-to-end event execution in the form builder application,
 * simulating real user workflows including:
 * - Creating forms with event handlers
 * - Configuring events in the editor
 * - Testing event execution in preview mode
 * - Verifying error handling and user feedback
 *
 * Prerequisites:
 * - Playwright must be installed and configured
 * - Application running at http://localhost:3003
 * - Mock API server available
 *
 * Run tests:
 * npx playwright test tests/e2e/eventExecution.spec.ts
 *
 * Run with UI:
 * npx playwright test tests/e2e/eventExecution.spec.ts --ui
 */

import { test, expect, Page } from '@playwright/test'

/**
 * Test configuration
 */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3003'
const TEST_TIMEOUT = 30000

/**
 * Helper functions
 */

/**
 * Navigate to the home page
 */
async function goToHomePage(page: Page) {
  await page.goto(BASE_URL)
  await page.waitForLoadState('networkidle')
}

/**
 * Create a new form with specified URL and title
 */
async function createNewForm(page: Page, url: string, title: string) {
  // Click the create new form button
  await page.click('text=创建新表单')

  // Wait for editor page to load
  await page.waitForURL('**/editor')
  await page.waitForLoadState('networkidle')

  // Fill in URL and title
  await page.fill('input[placeholder="请输入页面URL"]', url)
  await page.fill('input[placeholder="请输入页面标题"]', title)
}

/**
 * Drag a component to the canvas
 */
async function dragComponentToCanvas(page: Page, componentType: string, componentLabel: string) {
  // Switch to the appropriate tab if needed
  if (['Input', 'Textarea', 'Select', 'DatePicker', 'InputNumber'].includes(componentType)) {
    await page.click('text=表单组件')
  } else {
    await page.click('text=容器')
  }

  // Find the component and drag it to canvas
  const component = page.locator(`.component-item:has-text("${componentLabel}")`).first()

  // Get component and canvas positions
  const componentBox = await component.boundingBox()
  const canvas = page.locator('.canvas').first()
  const canvasBox = await canvas.boundingBox()

  if (!componentBox || !canvasBox) {
    throw new Error('Could not get element positions')
  }

  // Perform drag and drop
  await page.mouse.move(
    componentBox.x + componentBox.width / 2,
    componentBox.y + componentBox.height / 2
  )
  await page.mouse.down()
  await page.mouse.move(
    canvasBox.x + canvasBox.width / 2,
    canvasBox.y + canvasBox.height / 2,
    { steps: 10 }
  )
  await page.mouse.up()

  // Wait for component to be added
  await page.waitForTimeout(500)
}

/**
 * Select a node on the canvas
 */
async function selectNode(page: Page, nodeLabel: string) {
  await page.click(`.canvas-node:has-text("${nodeLabel}")`)
  await page.waitForTimeout(300)
}

/**
 * Configure event handler for selected node
 */
async function configureEventHandler(
  page: Page,
  eventType: string,
  eventCode: string
) {
  // Click on events tab in properties panel
  await page.click('text=事件配置')

  // Select event type
  await page.selectOption('select:event-type-select', eventType)

  // Enter event code
  const codeEditor = page.locator('.event-code-editor').or(
    page.locator('textarea[placeholder*="事件代码"]')
  ).or(
    page.locator('textarea').nth(0)
  )

  await codeEditor.fill(eventCode)

  // Save event configuration
  await page.click('text=保存事件')
  await page.waitForTimeout(300)
}

/**
 * Save the form
 */
async function saveForm(page: Page) {
  await page.click('button:has-text("保存")')
  await page.waitForTimeout(1000)

  // Verify save success message
  await expect(page.locator('text=保存成功').or(page.locator('.el-message--success'))).toBeVisible()
}

/**
 * Navigate to preview mode
 */
async function goToPreview(page: Page, url: string) {
  await page.click('button:has-text("预览")')
  await page.waitForURL(`**/preview/${url}`)
  await page.waitForLoadState('networkidle')
}

/**
 * Trigger an event on a form field
 */
async function triggerEvent(
  page: Page,
  fieldLabel: string,
  eventType: 'blur' | 'change' | 'focus' | 'click',
  value?: string
) {
  const input = page.locator(`input[placeholder*="${fieldLabel}"]`).or(
    page.locator(`.el-input:has-text("${fieldLabel}") input`)
  ).or(
    page.locator(`input`).first()
  )

  if (value !== undefined) {
    await input.fill(value)
  }

  // Trigger appropriate event
  switch (eventType) {
    case 'blur':
      await input.blur()
      break
    case 'focus':
      await input.focus()
      break
    case 'change':
      await input.fill(value || '')
      await input.blur() // Blur triggers change event
      break
    case 'click':
      await input.click()
      break
  }

  await page.waitForTimeout(300)
}

/**
 * Verify console output
 */
async function verifyConsoleOutput(page: Page, expectedMessage: string) {
  // Check for message in console logs
  const logs: string[] = []
  page.on('console', msg => {
    logs.push(msg.text())
  })

  await page.waitForTimeout(500)

  const found = logs.some(log => log.includes(expectedMessage))
  expect(found).toBe(true)
}

/**
 * Verify form data value
 */
async function verifyFormDataValue(page: Page, field: string, expectedValue: any) {
  await page.click('button:has-text("查看数据")')

  const dataDialog = page.locator('.el-dialog').or(page.locator('[role="dialog"]'))
  await expect(dataDialog).toBeVisible()

  const dataContent = await dataDialog.locator('pre').textContent()
  const formData = JSON.parse(dataContent || '{}')

  expect(formData[field]).toBe(expectedValue)

  // Close dialog
  await page.click('.el-dialog__close').or(page.locator('button:has-text("关闭")'))
  await page.waitForTimeout(300)
}

/**
 * Test Suite
 */

test.describe('Event Execution E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up console log tracking
    page.on('console', msg => {
      console.log('[Browser Console]', msg.type(), msg.text())
    })

    // Set up error tracking
    page.on('pageerror', error => {
      console.error('[Browser Error]', error)
    })
  })

  test('should complete full workflow: create form with events and verify execution', async ({
    page
  }) => {
    // Step 1: Navigate to home page
    await goToHomePage(page)
    await expect(page.locator('h1:has-text("表单列表")').or(page.locator('text=表单编排'))).toBeVisible()

    // Step 2: Create new form
    const formUrl = 'test-event-execution-' + Date.now()
    const formTitle = 'Event Execution Test Form'
    await createNewForm(page, formUrl, formTitle)

    // Step 3: Add Input component with blur event
    await dragComponentToCanvas(page, 'Input', '输入框')
    await selectNode(page, '输入框')

    // Configure blur event to uppercase the input
    const blurEventCode = `
console.log('Blur event triggered')
const username = $getField('username')
if (username) {
  $setField('username', username.toUpperCase())
  $setField('validated', true)
  console.log('Username transformed to:', username.toUpperCase())
}
    `.trim()

    await configureEventHandler(page, 'blur', blurEventCode)

    // Set field name
    await page.click('text=属性配置')
    const modelInput = page.locator('input[placeholder*="字段名"]').or(
      page.locator('input').nth(0)
    )
    await modelInput.fill('username')

    // Step 4: Add another Input with change event
    await dragComponentToCanvas(page, 'Input', '输入框')
    await selectNode(page, '输入框')

    // Configure change event for email validation
    const changeEventCode = `
const email = $getField('email')
const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/

if (email && !emailRegex.test(email)) {
  console.warn('Invalid email format')
  $setField('emailValid', false)
} else if (email) {
  console.log('Valid email')
  $setField('emailValid', true)
}
    `.trim()

    await configureEventHandler(page, 'change', changeEventCode)

    // Set field name
    await page.click('text=属性配置')
    await modelInput.fill('email')

    // Step 5: Save the form
    await saveForm(page)

    // Step 6: Go to preview mode
    await goToPreview(page, formUrl)

    // Step 7: Test blur event execution
    await triggerEvent(page, '', 'blur', 'john doe')

    // Wait for event to execute
    await page.waitForTimeout(1000)

    // Verify the data was transformed
    await verifyFormDataValue(page, 'username', 'JOHN DOE')
    await verifyFormDataValue(page, 'validated', true)

    // Step 8: Test change event execution
    await triggerEvent(page, '', 'change', 'invalid-email')

    await page.waitForTimeout(1000)

    // Verify email validation
    await verifyFormDataValue(page, 'emailValid', false)

    // Test with valid email
    await triggerEvent(page, '', 'change', 'test@example.com')

    await page.waitForTimeout(1000)

    await verifyFormDataValue(page, 'emailValid', true)

    // Step 9: Verify all form data
    await page.click('button:has-text("查看数据")')

    const dataDialog = page.locator('.el-dialog')
    const dataContent = await dataDialog.locator('pre').textContent()
    const formData = JSON.parse(dataContent || '{}')

    expect(formData.username).toBe('JOHN DOE')
    expect(formData.email).toBe('test@example.com')
    expect(formData.validated).toBe(true)
    expect(formData.emailValid).toBe(true)

    console.log('✅ Full workflow test passed!')
  })

  test('should handle complex event logic with conditional validation', async ({ page }) => {
    // Create form with age validation
    await goToHomePage(page)
    await createNewForm(page, 'age-validation-' + Date.now(), 'Age Validation Form')

    // Add age input
    await dragComponentToCanvas(page, 'InputNumber', '计数器')
    await selectNode(page, '计数器')

    const ageEventCode = `
const age = $getField('age')

if (age < 18) {
  console.log('Underage user detected')
  $setField('isAdult', false)
  $setField('status', 'underage')
} else if (age >= 18 && age < 65) {
  console.log('Adult user')
  $setField('isAdult', true)
  $setField('status', 'adult')
} else {
  console.log('Senior user')
  $setField('isAdult', true)
  $setField('status', 'senior')
}

console.log('Age validation completed, status:', $getField('status'))
    `.trim()

    await configureEventHandler(page, 'change', ageEventCode)

    // Set field name
    await page.click('text=属性配置')
    const modelInput = page.locator('input[placeholder*="字段名"]').or(
      page.locator('input').nth(0)
    )
    await modelInput.fill('age')

    await saveForm(page)
    await goToPreview(page, 'age-validation-' + Date.now())

    // Test underage
    await triggerEvent(page, '', 'change', '15')
    await page.waitForTimeout(500)
    await verifyFormDataValue(page, 'isAdult', false)
    await verifyFormDataValue(page, 'status', 'underage')

    // Test adult
    await triggerEvent(page, '', 'change', '25')
    await page.waitForTimeout(500)
    await verifyFormDataValue(page, 'isAdult', true)
    await verifyFormDataValue(page, 'status', 'adult')

    // Test senior
    await triggerEvent(page, '', 'change', '70')
    await page.waitForTimeout(500)
    await verifyFormDataValue(page, 'isAdult', true)
    await verifyFormDataValue(page, 'status', 'senior')

    console.log('✅ Complex validation logic test passed!')
  })

  test('should display user-friendly error messages for invalid event code', async ({
    page
  }) => {
    await goToHomePage(page)
    await createNewForm(page, 'error-test-' + Date.now(), 'Error Handling Test')

    await dragComponentToCanvas(page, 'Input', '输入框')
    await selectNode(page, '输入框')

    // Add event with syntax error
    const invalidEventCode = `
const x = undefinedVariable
console.log(x)
    `.trim()

    await configureEventHandler(page, 'blur', invalidEventCode)

    // Set field name
    await page.click('text=属性配置')
    const modelInput = page.locator('input[placeholder*="字段名"]').or(
      page.locator('input').nth(0)
    )
    await modelInput.fill('testField')

    await saveForm(page)
    await goToPreview(page, 'error-test-' + Date.now())

    // Trigger the event
    await triggerEvent(page, '', 'blur', 'test')

    await page.waitForTimeout(1000)

    // Check for error message in UI
    const errorMessage = page.locator('.el-message--error').or(
      page.locator('text=事件执行')
    )

    // Error should be displayed
    await expect(errorMessage).toBeVisible({ timeout: 3000 })

    console.log('✅ Error handling test passed!')
  })

  test('should prevent execution of dangerous code patterns', async ({ page }) => {
    await goToHomePage(page)
    await createNewForm(page, 'security-test-' + Date.now(), 'Security Test')

    await dragComponentToCanvas(page, 'Input', '输入框')
    await selectNode(page, '输入框')

    // Try to add event with dangerous code
    const dangerousCode = `
eval('console.log("dangerous")')
    `.trim()

    await configureEventHandler(page, 'blur', dangerousCode)

    await saveForm(page)
    await goToPreview(page, 'security-test-' + Date.now())

    // Trigger the event
    await triggerEvent(page, '', 'blur', 'test')

    await page.waitForTimeout(1000)

    // Should show security error
    const errorMessage = page.locator('.el-message--error').or(
      page.locator('text=不安全')
    )

    await expect(errorMessage).toBeVisible({ timeout: 3000 })

    console.log('✅ Security test passed!')
  })

  test('should handle multiple events on same component', async ({ page }) => {
    await goToHomePage(page)
    await createNewForm(page, 'multi-event-' + Date.now(), 'Multiple Events Test')

    await dragComponentToCanvas(page, 'Input', '输入框')
    await selectNode(page, '输入框')

    // Configure focus event
    await configureEventHandler(page, 'focus', `
console.log('Input focused')
$setField('focused', true)
    `.trim())

    // Configure blur event
    await page.click('button:has-text("添加事件")')
    await configureEventHandler(page, 'blur', `
console.log('Input blurred')
$setField('focused', false)
    `.trim())

    // Set field name
    await page.click('text=属性配置')
    const modelInput = page.locator('input[placeholder*="字段名"]').or(
      page.locator('input').nth(0)
    )
    await modelInput.fill('multiEvent')

    await saveForm(page)
    await goToPreview(page, 'multi-event-' + Date.now())

    // Test focus event
    await triggerEvent(page, '', 'focus', 'test')
    await page.waitForTimeout(500)
    await verifyFormDataValue(page, 'focused', true)

    // Test blur event
    await triggerEvent(page, '', 'blur', 'test')
    await page.waitForTimeout(500)
    await verifyFormDataValue(page, 'focused', false)

    console.log('✅ Multiple events test passed!')
  })

  test('should support data transformation events', async ({ page }) => {
    await goToHomePage(page)
    await createNewForm(page, 'transform-' + Date.now(), 'Data Transformation Test')

    // Add first name field
    await dragComponentToCanvas(page, 'Input', '输入框')
    await selectNode(page, '输入框')

    await page.click('text=属性配置')
    const modelInput = page.locator('input[placeholder*="字段名"]').or(
      page.locator('input').nth(0)
    )
    await modelInput.fill('firstName')

    // Add last name field
    await dragComponentToCanvas(page, 'Input', '输入框')
    await selectNode(page, '输入框')

    await page.click('text=属性配置')
    await modelInput.fill('lastName')

    // Configure blur event to auto-generate full name
    await configureEventHandler(page, 'blur', `
const firstName = $getField('firstName') || ''
const lastName = $getField('lastName') || ''
const fullName = (firstName + ' ' + lastName).trim()

$setField('fullName', fullName)
console.log('Generated full name:', fullName)
    `.trim())

    await saveForm(page)
    await goToPreview(page, 'transform-' + Date.now())

    // Fill in names
    const inputs = await page.locator('input').all()
    await inputs[0].fill('John')
    await inputs[1].fill('Doe')
    await inputs[1].blur()

    await page.waitForTimeout(1000)

    // Verify full name was generated
    await verifyFormDataValue(page, 'fullName', 'John Doe')

    console.log('✅ Data transformation test passed!')
  })

  test('should handle form submission validation events', async ({ page }) => {
    await goToHomePage(page)
    await createNewForm(page, 'submit-test-' + Date.now(), 'Form Submission Test')

    // Add username field
    await dragComponentToCanvas(page, 'Input', '输入框')
    await selectNode(page, '输入框')

    await page.click('text=属性配置')
    const modelInput = page.locator('input[placeholder*="字段名"]').or(
      page.locator('input').nth(0)
    )
    await modelInput.fill('username')

    // Make it required
    const requiredCheckbox = page.locator('input[type="checkbox"]').or(
      page.locator('.el-checkbox')
    ).first()
    await requiredCheckbox.check()

    await saveForm(page)
    await goToPreview(page, 'submit-test-' + Date.now())

    // Try to submit without filling required field
    await page.click('button:has-text("提交")')
    await page.waitForTimeout(500)

    // Should show validation error
    const errorMessage = page.locator('.el-form-item__error').or(
      page.locator('text=必填')
    )

    await expect(errorMessage).toBeVisible()

    // Fill the field and submit again
    await page.fill('input', 'testuser')
    await page.click('button:has-text("提交")')
    await page.waitForTimeout(1000)

    // Should show success message
    const successMessage = page.locator('.el-message--success').or(
      page.locator('text=验证通过')
    )

    await expect(successMessage).toBeVisible()

    console.log('✅ Form submission validation test passed!')
  })
})

/**
 * Performance Tests
 */
test.describe('Event Execution Performance Tests', () => {
  test('should handle rapid event triggering without errors', async ({ page }) => {
    await goToHomePage(page)
    await createNewForm(page, 'perf-test-' + Date.now(), 'Performance Test')

    await dragComponentToCanvas(page, 'Input', '输入框')
    await selectNode(page, '输入框')

    await configureEventHandler(page, 'input', `
const value = $getField('perfField')
$setField('lastUpdate', new Date().toISOString())
    `.trim())

    await page.click('text=属性配置')
    const modelInput = page.locator('input[placeholder*="字段名"]').or(
      page.locator('input').nth(0)
    )
    await modelInput.fill('perfField')

    await saveForm(page)
    await goToPreview(page, 'perf-test-' + Date.now())

    const input = page.locator('input').first()

    // Trigger rapid input events
    for (let i = 0; i < 10; i++) {
      await input.fill(`test${i}`)
      await page.waitForTimeout(50)
    }

    await page.waitForTimeout(1000)

    // Verify last update was set
    await page.click('button:has-text("查看数据")')

    const dataDialog = page.locator('.el-dialog')
    const dataContent = await dataDialog.locator('pre').textContent()
    const formData = JSON.parse(dataContent || '{}')

    expect(formData.lastUpdate).toBeDefined()
    expect(formData.perfField).toBe('test9')

    console.log('✅ Performance test passed!')
  })
})

/**
 * Accessibility Tests
 */
test.describe('Event Execution Accessibility Tests', () => {
  test('should work with keyboard navigation', async ({ page }) => {
    await goToHomePage(page)
    await createNewForm(page, 'a11y-test-' + Date.now(), 'Accessibility Test')

    await dragComponentToCanvas(page, 'Input', '输入框')
    await selectNode(page, '输入框')

    await configureEventHandler(page, 'blur', `
console.log('Field blurred via keyboard')
$setField('touched', true)
    `.trim())

    await page.click('text=属性配置')
    const modelInput = page.locator('input[placeholder*="字段名"]').or(
      page.locator('input').nth(0)
    )
    await modelInput.fill('keyboardField')

    await saveForm(page)
    await goToPreview(page, 'a11y-test-' + Date.now())

    const input = page.locator('input').first()

    // Use keyboard to navigate and interact
    await input.focus()
    await input.fill('test')
    await page.keyboard.press('Tab')

    await page.waitForTimeout(500)

    // Verify blur event was triggered
    await verifyFormDataValue(page, 'touched', true)

    console.log('✅ Accessibility test passed!')
  })
})
