# 事件系统使用指南

## 概述

Eflow2 事件系统是一个强大而安全的动态事件执行引擎，允许用户通过配置方式为表单组件添加自定义交互逻辑，无需编写任何代码。该系统提供了丰富的 API 和完善的错误处理机制，确保在安全的前提下实现复杂的业务逻辑。

### 核心特性

- **安全执行环境**：内置代码安全验证，阻止危险操作
- **丰富的 API**：提供表单数据操作、消息提示、通知等实用功能
- **友好错误提示**：智能的错误信息格式化，帮助快速定位问题
- **类型安全**：完整的 TypeScript 类型定义
- **灵活的事件绑定**：支持组件事件和生命周期事件

---

## 可用的事件类型

### 1. 表单组件事件

表单组件支持以下事件类型：

| 事件名 | 触发时机 | 适用组件 |
|--------|---------|---------|
| `change` | 值改变时 | Input, InputNumber, Select, Switch, DatePicker, TimePicker |
| `blur` | 失去焦点时 | Input, InputNumber |
| `focus` | 获得焦点时 | Input, InputNumber |
| `clear` | 清空值时 | Input, Select |

### 2. 生命周期事件

| 事件名 | 触发时机 |
|--------|---------|
| `mounted` | 组件挂载完成 |
| `updated` | 组件更新完成 |
| `beforeUnmount` | 组件卸载前 |

---

## 事件执行上下文

在事件处理代码中，可以使用以下预定义的变量和 API：

### 基础上下文变量

#### `$data`
**类型**: `Record<string, any>`

当前表单的所有数据对象，可以读取和修改任何字段的值。

```javascript
// 读取字段值
const name = $data.name

// 修改字段值（不推荐，建议使用 $setField）
$data.age = 25
```

#### `$event`
**类型**: `Event`

触发事件的原始事件对象。

```javascript
// 阻止事件冒泡
$event.stopPropagation()

// 阻止默认行为
$event.preventDefault()
```

#### `$args`
**类型**: `any[]`

事件处理器的额外参数数组。

```javascript
// 获取第一个参数
const firstArg = $args[0]
```

### 表单数据操作 API

#### `$setField(field, value)`
设置表单字段的值。

**参数**:
- `field` (string): 字段名
- `value` (any): 字段值

**返回值**: 无

```javascript
// 设置单个字段
$setField('name', '张三')

// 根据条件设置字段
if ($data.age < 18) {
  $setField('status', '未成年')
} else {
  $setField('status', '成年')
}

// 批量设置字段
$setField('firstName', '张')
$setField('lastName', '三')
$setField('fullName', '张三')
```

#### `$getField(field)`
获取表单字段的值。

**参数**:
- `field` (string): 字段名

**返回值**: `any` - 字段的值，如果字段不存在返回 `undefined`

```javascript
// 获取字段值
const age = $getField('age')

// 安全地获取嵌套字段
const city = $getField('address.city')

// 使用字段值进行计算
const total = $getField('price') * $getField('quantity')
```

### 消息提示 API

#### `$message`
显示全局消息提示。

**方法**:
- `$message.success(msg)` - 成功消息（绿色）
- `$message.warning(msg)` - 警告消息（橙色）
- `$message.info(msg)` - 信息消息（蓝色）
- `$message.error(msg)` - 错误消息（红色）

```javascript
// 成功提示
$message.success('保存成功！')

// 警告提示
$message.warning('请注意检查输入内容')

// 信息提示
$message.info('正在处理中...')

// 错误提示
$message.error('操作失败，请重试')
```

#### `$notify`
显示全局通知（更持久，通常显示在右上角）。

**方法**:
- `$notify.success(msg)` - 成功通知
- `$notify.warning(msg)` - 警告通知
- `$notify.info(msg)` - 信息通知
- `$notify.error(msg)` - 错误通知

```javascript
// 成功通知
$notify.success('数据已更新')

// 警告通知
$notify.warning('库存不足')

// 错误通知
$notify.error('连接失败')
```

### 内置工具对象

#### `console`
控制台输出工具，用于调试。

```javascript
console.log('调试信息')
console.warn('警告信息')
console.error('错误信息')
```

#### `Math`
数学计算工具。

```javascript
// 计算最大值
const max = Math.max(1, 2, 3)

// 向上取整
const rounded = Math.ceil(4.2)

// 生成随机数
const random = Math.random()
```

#### `Date`
日期时间工具。

```javascript
// 获取当前时间
const now = new Date()

// 格式化日期
const year = now.getFullYear()
const month = now.getMonth() + 1
const day = now.getDate()
```

#### `JSON`
JSON 序列化和反序列化工具。

```javascript
// 对象转 JSON 字符串
const jsonStr = JSON.stringify({ name: '张三', age: 25 })

// JSON 字符串转对象
const obj = JSON.parse(jsonStr)
```

#### `Object`, `Array`, `String`, `Number`, `Boolean`
JavaScript 原生对象构造函数。

```javascript
// 创建对象
const obj = Object.create(null)

// 数组操作
const arr = Array.from([1, 2, 3])

// 字符串操作
const upper = String('hello').toUpperCase()
```

---

## 使用示例

### 示例 1: 基础输入验证

**场景**: 验证年龄输入，必须大于 18 岁。

**事件**: `change` (年龄字段)

```javascript
// 获取年龄值
const age = $getField('age')

// 验证年龄
if (age && age < 18) {
  $message.warning('年龄必须大于 18 岁')
  $setField('age', '') // 清空无效输入
  return false
}

$message.success('年龄验证通过')
return true
```

### 示例 2: 数据联动 - 自动计算总价

**场景**: 根据单价和数量自动计算总价。

**事件**: `change` (单价或数量字段)

```javascript
// 获取单价和数量
const price = $getField('price') || 0
const quantity = $getField('quantity') || 0

// 计算总价
const total = price * quantity

// 更新总价字段
$setField('total', total)

// 显示提示
$message.info(`总价已更新: ${total}`)
```

### 示例 3: 数据联动 - 省市区级联

**场景**: 选择省份后，自动更新城市列表。

**事件**: `change` (省份字段)

```javascript
// 获取选中的省份
const province = $getField('province')

// 根据省份设置不同的城市选项
const cityOptions = {
  '广东省': ['广州', '深圳', '珠海'],
  '浙江省': ['杭州', '宁波', '温州'],
  '江苏省': ['南京', '苏州', '无锡']
}

// 更新城市字段的选项（假设表单支持）
if (province && cityOptions[province]) {
  $message.info(`已切换到 ${province}，请选择城市`)
  // 这里可以设置城市字段的选项，具体实现取决于表单配置
  $setField('city', '') // 清空之前选择的城市
}
```

### 示例 4: 复杂计算 - 订单折扣

**场景**: 根据订单金额自动计算折扣。

**事件**: `change` (订单金额字段)

```javascript
// 获取订单金额
const amount = $getField('orderAmount') || 0

// 计算折扣
let discount = 0
if (amount >= 1000) {
  discount = 0.1 // 10% 折扣
  $message.success('订单金额满 1000，享受 9 折优惠！')
} else if (amount >= 500) {
  discount = 0.05 // 5% 折扣
  $message.info('订单金额满 500，享受 9.5 折优惠')
}

// 计算折后金额
const discountedAmount = amount * (1 - discount)

// 更新字段
$setField('discount', discount)
$setField('discountedAmount', discountedAmount)
```

### 示例 5: 表单验证 - 密码确认

**场景**: 验证两次输入的密码是否一致。

**事件**: `blur` (确认密码字段)

```javascript
// 获取密码和确认密码
const password = $getField('password')
const confirmPassword = $getField('confirmPassword')

// 验证密码一致性
if (confirmPassword && password !== confirmPassword) {
  $message.error('两次输入的密码不一致，请重新输入')
  $setField('confirmPassword', '') // 清空确认密码
  return false
}

if (confirmPassword && password === confirmPassword) {
  $message.success('密码确认成功')
}

return true
```

### 示例 6: 数据格式化 - 手机号格式化

**场景**: 自动格式化手机号为标准格式。

**事件**: `blur` (手机号字段)

```javascript
// 获取手机号
let phone = $getField('phone')

if (!phone) return

// 移除非数字字符
phone = phone.replace(/\D/g, '')

// 验证手机号长度
if (phone.length !== 11) {
  $message.warning('请输入正确的 11 位手机号')
  $setField('phone', '')
  return
}

// 格式化手机号：138 1234 5678
const formatted = `${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`

// 更新字段
$setField('phone', formatted)
$message.success('手机号格式化成功')
```

### 示例 7: 条件显示 - 根据选项显示不同字段

**场景**: 根据用户类型显示不同的必填字段。

**事件**: `change` (用户类型字段)

```javascript
// 获取用户类型
const userType = $getField('userType')

// 根据用户类型设置不同的提示信息
switch (userType) {
  case 'individual':
    $message.info('个人用户请填写身份证号')
    $setField('requiredField', 'idCard')
    break
  case 'company':
    $message.info('企业用户请填写统一社会信用代码')
    $setField('requiredField', 'creditCode')
    break
  case 'government':
    $message.info('政府机构请填写组织机构代码')
    $setField('requiredField', 'orgCode')
    break
  default:
    $message.warning('请选择用户类型')
}
```

### 示例 8: 数据转换 - 姓名拼音转换

**场景**: 将中文姓名转换为拼音（模拟）。

**事件**: `blur` (姓名字段)

```javascript
// 获取姓名
const name = $getField('name')

if (!name) {
  $message.warning('请输入姓名')
  return
}

// 简单的拼音映射（实际项目中应使用专业的拼音库）
const pinyinMap = {
  '张': 'Zhang',
  '三': 'San',
  '李': 'Li',
  '四': 'Si'
}

// 模拟转换
let pinyin = ''
for (let i = 0; i < name.length; i++) {
  const char = name[i]
  pinyin += (pinyinMap[char] || char) + ' '
}

// 去除末尾空格
pinyin = pinyin.trim()

// 更新拼音字段
$setField('namePinyin', pinyin)
$message.info(`姓名拼音: ${pinyin}`)
```

### 示例 9: 生命周期事件 - 初始化数据

**场景**: 组件挂载时初始化默认值。

**事件**: `mounted` (组件生命周期)

```javascript
// 设置当前日期
const today = new Date()
$setField('currentDate', today.toISOString().split('T')[0])

// 设置默认状态
$setField('status', 'active')

// 生成唯一 ID
const uniqueId = Date.now().toString(36) + Math.random().toString(36).substr(2)
$setField('uniqueId', uniqueId)

$message.info('表单已初始化')
```

### 示例 10: 错误处理 - 安全的数据处理

**场景**: 安全地处理可能为空的数据。

**事件**: `change` (任意字段)

```javascript
// 安全地获取字段值
const value = $getField('someField')

// 检查值是否存在
if (value === undefined || value === null || value === '') {
  $message.warning('字段值不能为空')
  return false
}

// 安全地进行数值计算
const numValue = Number(value)
if (isNaN(numValue)) {
  $message.error('请输入有效的数字')
  return false
}

// 安全地处理数组
const items = $getField('items')
if (!Array.isArray(items)) {
  $message.error('items 必须是数组')
  return false
}

// 所有检查通过
$message.success('数据处理成功')
return true
```

### 示例 11: 高级逻辑 - 表单积分计算

**场景**: 根据多个字段计算用户积分。

**事件**: `change` (相关字段)

```javascript
// 获取基础分值
const baseScore = $getField('baseScore') || 0

// 获取加成项
const hasVerifiedEmail = $getField('verifiedEmail') ? 10 : 0
const hasVerifiedPhone = $getField('verifiedPhone') ? 20 : 0
const hasCompletedProfile = $getField('completedProfile') ? 30 : 0

// 计算总积分
const totalScore = baseScore + hasVerifiedEmail + hasVerifiedPhone + hasCompletedProfile

// 根据积分确定等级
let level = '普通会员'
if (totalScore >= 100) {
  level = '钻石会员'
} else if (totalScore >= 50) {
  level = '黄金会员'
} else if (totalScore >= 20) {
  level = '白银会员'
}

// 更新字段
$setField('totalScore', totalScore)
$setField('memberLevel', level)

// 显示结果
$message.success(`当前积分: ${totalScore}，会员等级: ${level}`)
```

### 示例 12: 数据验证 - 身份证号验证

**场景**: 验证身份证号格式和校验码。

**事件**: `blur` (身份证号字段)

```javascript
// 获取身份证号
const idCard = $getField('idCard')

if (!idCard) {
  $message.warning('请输入身份证号')
  return false
}

// 验证长度
if (idCard.length !== 18) {
  $message.error('身份证号必须为 18 位')
  return false
}

// 验证格式（前 17 位必须是数字）
const front17 = idCard.slice(0, 17)
if (!/^\d{17}$/.test(front17)) {
  $message.error('身份证号前 17 位必须为数字')
  return false
}

// 验证校验码（最后一位可以是数字或 X）
const lastChar = idCard[17].toUpperCase()
if (!/^\d|X$/.test(lastChar)) {
  $message.error('身份证号最后一位格式错误')
  return false
}

// 计算校验码
const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

let sum = 0
for (let i = 0; i < 17; i++) {
  sum += parseInt(front17[i]) * weights[i]
}

const computedCheckCode = checkCodes[sum % 11]

if (computedCheckCode !== lastChar) {
  $message.error('身份证号校验码错误，请检查输入')
  return false
}

// 验证通过，提取信息
const birthYear = parseInt(idCard.slice(6, 10))
const birthMonth = parseInt(idCard.slice(10, 12))
const birthDay = parseInt(idCard.slice(12, 14))
const genderCode = parseInt(idCard[16])
const gender = genderCode % 2 === 1 ? '男' : '女'

// 更新字段
$setField('birthDate', `${birthYear}-${birthMonth}-${birthDay}`)
$setField('gender', gender)

// 计算年龄
const today = new Date()
const age = today.getFullYear() - birthYear
$setField('age', age)

$message.success('身份证验证通过')
return true
```

---

## 安全限制说明

为了确保系统安全，事件执行环境禁止以下操作：

### 禁止的操作

1. **模块导入**
   - `import` 语句
   - `require()` 函数

2. **动态代码执行**
   - `eval()` 函数
   - `Function()` 构造函数

3. **异步操作**
   - `setTimeout()`
   - `setInterval()`

4. **DOM 访问**
   - `document` 对象
   - `window` 对象

5. **文件系统操作**
   - `fs` 模块
   - `__dirname`, `__filename`

6. **进程操作**
   - `process` 对象
   - `child_process` 模块

7. **原型链操作**
   - 修改 `Object.prototype`
   - 修改 `Array.prototype`
   - 其他原型链污染

### 错误示例

```javascript
// ❌ 这些代码将被拒绝
import { utils } from 'lodash'
const fs = require('fs')
eval('1 + 1')
new Function('return 1')
setTimeout(() => {}, 1000)
document.getElementById('test')
window.location
Object.prototype.toString = () => {}
```

---

## 最佳实践建议

### 1. 代码风格

- 使用清晰的变量命名
- 添加适当的注释
- 保持代码简洁明了

```javascript
// ✅ 好的代码风格
const userAge = $getField('age')
if (userAge < 18) {
  $message.warning('年龄必须大于 18 岁')
  return false
}

// ❌ 避免使用晦涩的变量名
const a = $getField('age')
if (a < 18) {
  $message.warning('error')
  return
}
```

### 2. 错误处理

- 始终验证输入数据
- 提供友好的错误提示
- 处理边界情况

```javascript
// ✅ 完善的错误处理
const value = $getField('quantity')
if (!value) {
  $message.warning('请输入数量')
  return false
}

const numValue = Number(value)
if (isNaN(numValue) || numValue <= 0) {
  $message.error('数量必须为正数')
  return false
}

// ❌ 缺少错误处理
const value = $getField('quantity')
$setField('total', value * price) // 可能导致 NaN
```

### 3. 性能优化

- 避免重复计算
- 使用缓存结果
- 减少不必要的字段更新

```javascript
// ✅ 优化后的代码
const price = $getField('price')
const quantity = $getField('quantity')

if (price && quantity) {
  const total = price * quantity
  $setField('total', total)
}

// ❌ 未优化的代码
$setField('total', $getField('price') * $getField('quantity')) // 多次调用 $getField
```

### 4. 用户体验

- 提供即时的反馈
- 使用适当的提示类型
- 避免过度提示

```javascript
// ✅ 良好的用户体验
const email = $getField('email')
if (email && !email.includes('@')) {
  $message.error('请输入有效的邮箱地址')
  return false
}
$message.success('邮箱格式正确')

// ❌ 过度的提示
const email = $getField('email')
$message.info('正在检查邮箱') // 不必要的提示
if (email) {
  $message.info('邮箱不为空') // 过度提示
}
```

### 5. 代码复用

- 将复杂逻辑拆分为多个步骤
- 使用清晰的函数式思维
- 避免代码重复

```javascript
// ✅ 清晰的逻辑结构
// 步骤 1: 验证输入
const age = $getField('age')
if (!age) {
  $message.warning('请输入年龄')
  return
}

// 步骤 2: 业务逻辑
let discount = 0
if (age >= 60) {
  discount = 0.2
} else if (age >= 18) {
  discount = 0.1
}

// 步骤 3: 更新数据
$setField('discount', discount)
$message.success(`已享受 ${(discount * 100).toFixed(0)}% 折扣`)
```

---

## 故障排查指南

### 常见错误及解决方案

#### 1. 变量未定义错误

**错误信息**: `变量 "xxx" 未定义`

**原因**: 使用了不存在的变量

**解决方案**:
- 检查变量名拼写
- 确认字段存在于表单中
- 使用 `$getField()` 而不是直接访问变量

```javascript
// ❌ 错误
const name = userName // userName 未定义

// ✅ 正确
const name = $getField('userName')
```

#### 2. 语法错误

**错误信息**: `事件执行错误: 语法错误 行 X 列 Y`

**原因**: 代码语法不正确

**解决方案**:
- 检查括号、引号是否配对
- 检查语句结尾是否正确
- 使用代码编辑器的语法检查

```javascript
// ❌ 错误
const name = 'test

// ✅ 正确
const name = 'test'
```

#### 3. 类型错误

**错误信息**: `无法读取属性或方法`

**原因**: 尝试访问 null 或 undefined 的属性

**解决方案**:
- 使用可选链操作符（如果支持）
- 先检查值是否存在
- 提供默认值

```javascript
// ❌ 错误
const city = $getField('address').city

// ✅ 正确
const address = $getField('address')
const city = address ? address.city : ''
```

#### 4. 安全限制错误

**错误信息**: `代码包含不安全的操作`

**原因**: 使用了被禁止的操作

**解决方案**:
- 移除 import/require 语句
- 不使用 eval/Function
- 不访问 document/window

```javascript
// ❌ 错误
eval('1 + 1')

// ✅ 正确
const result = 1 + 1
```

### 调试技巧

#### 1. 使用 console.log

```javascript
const value = $getField('someField')
console.log('当前值:', value)
console.log('值类型:', typeof value)
```

#### 2. 分步验证

```javascript
// 步骤 1
const step1 = $getField('field1')
console.log('步骤 1:', step1)

// 步骤 2
const step2 = step1 + 10
console.log('步骤 2:', step2)

// 步骤 3
$setField('result', step2)
$message.success('完成')
```

#### 3. 使用消息提示

```javascript
const value = $getField('test')
$message.info(`当前值: ${value}`)
```

---

## 高级用法

### 条件表达式

使用三元运算符简化条件逻辑：

```javascript
const age = $getField('age')
const level = age >= 18 ? '成年' : '未成年'
$setField('level', level)
```

### 逻辑运算符

使用逻辑运算符简化代码：

```javascript
// 短路求值
const name = $getField('name') || '未命名'

// 逻辑与
if ($getField('age') && $getField('name')) {
  $message.success('信息完整')
}
```

### 数组方法

使用数组方法处理列表数据：

```javascript
// 获取数组
const items = $getField('items') || []

// 过滤
const filtered = items.filter(item => item.active)

// 映射
const names = items.map(item => item.name)

// 归约
const total = items.reduce((sum, item) => sum + item.value, 0)
```

### 对象操作

使用对象方法处理数据：

```javascript
// 获取对象
const user = $getField('user') || {}

// 获取所有键
const keys = Object.keys(user)

// 获取所有值
const values = Object.values(user)

// 对象合并
const merged = Object.assign({}, user, { age: 25 })
```

---

## 附录

### API 快速参考

| API | 说明 | 示例 |
|-----|------|------|
| `$data` | 表单数据对象 | `$data.name` |
| `$event` | 事件对象 | `$event.preventDefault()` |
| `$args` | 参数数组 | `$args[0]` |
| `$setField(field, value)` | 设置字段值 | `$setField('name', '张三')` |
| `$getField(field)` | 获取字段值 | `$getField('name')` |
| `$message.success(msg)` | 成功消息 | `$message.success('成功')` |
| `$message.warning(msg)` | 警告消息 | `$message.warning('警告')` |
| `$message.info(msg)` | 信息消息 | `$message.info('信息')` |
| `$message.error(msg)` | 错误消息 | `$message.error('错误')` |
| `$notify.success(msg)` | 成功通知 | `$notify.success('通知')` |

### 支持的组件类型

- Input (文本输入框)
- InputNumber (数字输入框)
- Select (下拉选择器)
- Switch (开关)
- DatePicker (日期选择器)
- TimePicker (时间选择器)

### 支持的事件类型

- change (值改变)
- blur (失去焦点)
- focus (获得焦点)
- clear (清空)
- mounted (组件挂载)
- updated (组件更新)
- beforeUnmount (组件卸载前)

---

## 获取帮助

如果您在使用事件系统时遇到问题：

1. 查看本文档的故障排查部分
2. 检查浏览器控制台的错误信息
3. 使用 `console.log()` 调试代码
4. 参考本文档的示例代码

---

**文档版本**: 1.0.0
**最后更新**: 2026-04-23
**维护者**: Eflow2 开发团队
