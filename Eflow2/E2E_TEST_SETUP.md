# E2E测试设置说明

## 概述

本项目已创建完整的端到端(E2E)测试套件,用于验证事件执行功能的实际使用场景。测试使用Playwright框架。

## 当前状态

✅ **已创建的文件:**
- `tests/e2e/eventExecution.spec.ts` - 完整的E2E测试套件
- `playwright.config.ts` - Playwright配置文件
- `tests/e2e/README.md` - 详细的测试文档
- `package.json` - 已更新测试脚本

⚠️ **需要完成的步骤:**
1. 安装Playwright依赖
2. 安装浏览器驱动
3. 运行测试验证

## 快速开始

### 1. 安装依赖

```bash
npm install -D @playwright/test
```

### 2. 安装浏览器

```bash
npx playwright install
```

如只需安装Chromium:
```bash
npx playwright install chromium
```

### 3. 运行测试

```bash
# 运行所有E2E测试
npm run test:e2e

# 使用UI模式运行(推荐)
npm run test:e2e:ui

# 调试模式运行
npm run test:e2e:debug

# 显示浏览器窗口运行
npm run test:e2e:headed
```

### 4. 查看测试报告

```bash
npm run test:e2e:report
```

## 测试覆盖场景

### 1. 完整用户流程测试
- ✅ 创建新表单
- ✅ 拖拽组件到画布
- ✅ 配置事件处理代码
- ✅ 保存表单
- ✅ 进入预览模式
- ✅ 触发事件并验证结果

### 2. 事件执行测试
- ✅ Blur事件 - 失焦时触发数据转换
- ✅ Change事件 - 变更时执行验证
- ✅ Focus事件 - 聚焦时记录状态
- ✅ 多事件组合 - 同一组件多个事件

### 3. 数据操作测试
- ✅ 字段读取 (`$getField`)
- ✅ 字段设置 (`$setField`)
- ✅ 条件逻辑验证
- ✅ 复杂计算
- ✅ 数据转换

### 4. 错误处理测试
- ✅ 运行时错误捕获
- ✅ 友好的错误提示
- ✅ 危险代码拦截
- ✅ 语法错误处理

### 5. 性能测试
- ✅ 快速连续事件触发
- ✅ 事件执行效率

### 6. 可访问性测试
- ✅ 键盘导航
- ✅ 焦点管理

## 测试示例

### 场景1: 表单验证工作流

```typescript
// 1. 创建表单
await createNewForm(page, 'user-form', '用户注册表单')

// 2. 添加用户名输入框
await dragComponentToCanvas(page, 'Input', '输入框')

// 3. 配置blur事件 - 自动转大写
await configureEventHandler(page, 'blur', `
  const username = $getField('username')
  $setField('username', username.toUpperCase())
`)

// 4. 保存并预览
await saveForm(page)
await goToPreview(page, 'user-form')

// 5. 测试事件执行
await triggerEvent(page, '', 'blur', 'john doe')

// 6. 验证结果
await verifyFormDataValue(page, 'username', 'JOHN DOE')
```

### 场景2: 条件验证逻辑

```typescript
// 年龄验证 - 根据年龄设置状态
const ageEventCode = `
const age = $getField('age')

if (age < 18) {
  $setField('isAdult', false)
  $setField('status', 'underage')
} else if (age >= 18 && age < 65) {
  $setField('isAdult', true)
  $setField('status', 'adult')
} else {
  $setField('isAdult', true)
  $setField('status', 'senior')
}
`

await configureEventHandler(page, 'change', ageEventCode)
```

### 场景3: 错误处理

```typescript
// 测试未定义变量错误
const invalidCode = `
const x = undefinedVariable
console.log(x)
`

await configureEventHandler(page, 'blur', invalidCode)

// 触发事件后应显示友好错误提示
// "变量 'undefinedVariable' 未定义"
```

## 测试辅助函数

测试文件包含以下可复用的辅助函数:

| 函数 | 用途 |
|------|------|
| `goToHomePage(page)` | 导航到首页 |
| `createNewForm(page, url, title)` | 创建新表单 |
| `dragComponentToCanvas(page, type, label)` | 拖拽组件到画布 |
| `selectNode(page, label)` | 选择组件节点 |
| `configureEventHandler(page, type, code)` | 配置事件处理器 |
| `saveForm(page)` | 保存表单 |
| `goToPreview(page, url)` | 进入预览模式 |
| `triggerEvent(page, label, type, value)` | 触发事件 |
| `verifyFormDataValue(page, field, value)` | 验证表单数据 |

## 配置说明

### baseURL配置

在`playwright.config.ts`中配置应用地址:

```typescript
use: {
  baseURL: process.env.BASE_URL || 'http://localhost:3003'
}
```

可通过环境变量覆盖:
```bash
BASE_URL=http://localhost:3004 npm run test:e2e
```

### 自动启动服务器

配置已设置自动启动开发服务器:

```typescript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3003',
  reuseExistingServer: !process.env.CI
}
```

### 浏览器选择

默认在多个浏览器运行测试:
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

运行特定浏览器:
```bash
npx playwright test --project=chromium
```

## 故障排除

### 问题1: 测试无法连接服务器

**解决方案:**
```bash
# 手动启动服务器
npm run dev

# 或等待自动启动(最多120秒)
```

### 问题2: 测试超时

**解决方案:**
增加超时时间(在`playwright.config.ts`):
```typescript
timeout: 60 * 1000  // 60秒
```

### 问题3: 浏览器安装失败

**解决方案:**
```bash
# 强制重装
npx playwright install --force

# Ubuntu/Debian系统依赖
npx playwright install-deps
```

### 问题4: 元素选择器失败

**解决方案:**
1. 使用浏览器开发者工具检查元素
2. 添加`data-testid`属性到元素
3. 使用更稳定的选择器:
   - `data-testid` (推荐)
   - `aria-label`
   - 文本内容

## CI/CD集成

### GitHub Actions示例

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
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 最佳实践

### 1. 测试独立性
每个测试应该独立运行,不依赖其他测试的状态:

```typescript
test.beforeEach(async ({ page }) => {
  // 每个测试前清理或重置状态
  await goToHomePage(page)
})
```

### 2. 等待策略
使用适当的等待策略:

```typescript
// 等待网络空闲
await page.waitForLoadState('networkidle')

// 等待元素可见
await expect(page.locator('.button')).toBeVisible()

// 等待固定时间(必要时)
await page.waitForTimeout(500)
```

### 3. 选择器稳定性
优先使用稳定的选择器:

```typescript
// ✅ 好 - 使用data-testid
await page.click('[data-testid="submit-button"]')

// ❌ 差 - 使用CSS类
await page.click('.btn-primary')

// ⚠️ 可接受 - 使用文本
await page.click('button:has-text("提交")')
```

### 4. 错误处理
正确处理可能的错误:

```typescript
try {
  await page.click('.element')
} catch (error) {
  console.log('Element not found, handling gracefully')
}
```

### 5. 测试数据
使用唯一的测试数据避免冲突:

```typescript
const uniqueId = Date.now()
await createNewForm(page, `test-${uniqueId}`, 'Test Form')
```

## 下一步建议

### 短期
1. ✅ 安装Playwright依赖
2. ✅ 运行测试验证基本功能
3. ✅ 根据实际UI调整选择器
4. ✅ 添加`data-testid`属性到关键元素

### 中期
1. 扩展测试覆盖更多组件类型
2. 添加更多真实用户场景
3. 性能基准测试
4. 跨浏览器兼容性测试

### 长期
1. 集成到CI/CD流程
2. 视觉回归测试
3. API测试集成
4. 负载测试

## 参考资源

- [Playwright官方文档](https://playwright.dev/)
- [Playwright最佳实践](https://playwright.dev/docs/best-practices)
- [项目测试文档](./tests/e2e/README.md)
- [事件执行器文档](./docs/event-execution-guide.md)

## 支持

如有问题:
1. 查看`tests/e2e/README.md`详细文档
2. 运行`npm run test:e2e:debug`调试
3. 检查Playwright报告了解失败原因
4. 查看浏览器控制台和网络日志

## 总结

E2E测试已完整创建,覆盖事件执行的核心功能:
- ✅ 9个主要测试场景
- ✅ 完整的辅助函数库
- ✅ 配置文件和文档
- ✅ CI/CD集成示例

安装Playwright后即可开始使用!
