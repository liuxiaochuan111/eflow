# EFlow API 文档

## 目录

- [后端 API](#后端-api)
- [FormBuilder 组件 API](#formbuilder-组件-api)
- [配置清单 API](#配置清单-api)

## 后端 API

### 基础信息

- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`
- **响应格式**:

```typescript
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}
```

### 接口列表

#### 1. 获取表单列表

```http
GET /api/forms
```

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "form-uuid-1",
      "name": "用户基本信息",
      "schema": { /* Schema 对象 */ },
      "eventConfig": { /* 事件配置 */ },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. 获取表单详情

```http
GET /api/forms/:id
```

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 表单ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "form-uuid-1",
    "name": "用户基本信息",
    "schema": { /* Schema 对象 */ },
    "eventConfig": { /* 事件配置 */ },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. 创建表单

```http
POST /api/forms
```

**请求体**:

```json
{
  "name": "新表单",
  "schema": {
    "type": "Container",
    "component": "Container",
    "display": true,
    "options": {},
    "children": []
  },
  "eventConfig": {}
}
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 表单名称 |
| schema | SchemaTree | 否 | Schema 对象 |
| eventConfig | EventConfig | 否 | 事件配置 |

**响应示例**:

```json
{
  "code": 200,
  "message": "Form created successfully",
  "data": {
    "id": "new-form-uuid",
    "name": "新表单",
    "schema": { /* Schema 对象 */ },
    "eventConfig": {},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 4. 更新表单

```http
PUT /api/forms/:id
```

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 表单ID |

**请求体**:

```json
{
  "name": "更新后的表单名称",
  "schema": { /* Schema 对象 */ },
  "eventConfig": { /* 事件配置 */ }
}
```

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 否 | 表单名称 |
| schema | SchemaTree | 否 | Schema 对象 |
| eventConfig | EventConfig | 否 | 事件配置 |

**响应示例**:

```json
{
  "code": 200,
  "message": "Form updated successfully",
  "data": {
    "id": "form-uuid",
    "name": "更新后的表单名称",
    "schema": { /* Schema 对象 */ },
    "eventConfig": { /* 事件配置 */ },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### 5. 删除表单

```http
DELETE /api/forms/:id
```

**路径参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 表单ID |

**响应示例**:

```json
{
  "code": 200,
  "message": "Form deleted successfully",
  "data": null
}
```

## FormBuilder 组件 API

### Props

```typescript
interface Props {
  // 表单ID，用于从服务端加载 schema
  pageUrl?: string

  // 补充属性配置，会覆盖 schema 中的属性
  configData?: Record<string, any>

  // 组件映射配置，指定表单项用哪个控件渲染
  compConfig?: Record<string, string>

  // true=编排模式，false=使用模式
  isBuild?: boolean

  // 自定义函数，供事件联动调用
  customFuncs?: Record<string, Function>

  // 外部状态对象，可参与事件联动的数据流转
  State?: Record<string, any>

  // 跳过渲染的节点 model 列表
  skipModels?: string[]

  // v-model 绑定的表单数据
  modelValue?: Record<string, any>

  // 表单 Schema 结构
  schema?: SchemaTree

  // 事件配置
  eventConfig?: EventConfig
}
```

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 表单数据变化时触发 | (data: Record<string, any>) |
| renderEnd | 表单渲染完成时触发 | - |
| change | 字段值变化时触发 | (field: string, value: any) |

### Expose Methods

| 方法名 | 说明 | 类型 |
|--------|------|------|
| validate | 表单校验 | () => Promise\<boolean\> |
| clearValidate | 清除校验结果 | () => void |
| setSchemaByConfig | 批量设置节点属性 | (config: Record\<string, any\>, prop: string) => void |
| getFormData | 获取表单数据 | () => Record\<string, any\> |

### 使用示例

```vue
<template>
  <FormBuilder
    ref="formBuilderRef"
    v-model="formData"
    :schema="formSchema"
    :event-config="eventConfig"
    :is-build="false"
    :custom-funcs="customFuncs"
    :state="appState"
    @render-end="handleRenderEnd"
  />
</template>

<script setup>
import { ref } from 'vue'
import FormBuilder from '@/components/builder/FormBuilder.vue'

const formBuilderRef = ref()
const formData = ref({})

// 调用校验方法
const handleSubmit = async () => {
  const valid = await formBuilderRef.value.validate()
  if (valid) {
    const data = formBuilderRef.value.getFormData()
    console.log('表单数据:', data)
  }
}

// 批量设置属性
const setAttributes = () => {
  formBuilderRef.value.setSchemaByConfig({
    model1: true,
    model2: false
  }, 'display')
}
</script>
```

## 配置清单 API

### 容器配置

```typescript
interface ContainerConfig {
  type: 'Container'
  name: ContainerComponent  // 'Block' | 'Container' | 'Form' | 'Row'
  label: string              // 中文名称
  labelEn?: string           // 英文名称
  icon: string               // 图标名称
  props: Record<string, PropConfig>  // 可配置属性
  father: (ContainerComponent | '')[]  // 可放置的父容器
  defaultOptions?: Record<string, any>  // 默认选项
}
```

### 表单项配置

```typescript
interface FormItemConfig {
  type: 'FormItem'
  name: FormItemComponent  // 组件名称
  label: string            // 中文名称
  labelEn?: string         // 英文名称
  icon: string             // 图标名称
  props: Record<string, PropConfig>  // 可配置属性
  events: string[]         // 支持的事件列表
  father: (ContainerComponent | '')[]  // 可放置的父容器
  slots: Record<string, string>  // 支持的插槽
  defaultOptions?: Record<string, any>  // 默认选项
}
```

### 属性配置

```typescript
interface PropConfig {
  component: string   // 渲染组件类型（Input/Select/Switch等）
  default: any        // 默认值
  required?: boolean  // 是否必填
  type?: 'String' | 'Number' | 'Boolean' | 'Array' | 'Object'
  options?: any[]     // 选项（用于 Select）
  min?: number        // 最小值
  max?: number        // 最大值
  step?: number       // 步长
  placeholder?: string
  label?: string
}
```

### 获取配置

```typescript
import { CONTAINER_CONFIG, FORM_ITEM_CONFIG, getContainerConfig, getFormItemConfig } from '@/configs'

// 获取所有容器配置
const containers = CONTAINER_CONFIG

// 获取所有表单项配置
const formItems = FORM_ITEM_CONFIG

// 根据名称获取容器配置
const formConfig = getContainerConfig('Form')

// 根据名称获取表单项配置
const inputConfig = getFormItemConfig('Input')
```

## Schema 类型定义

### SchemaTree

```typescript
interface SchemaTree {
  type: 'Container'
  component: 'Container'
  display: boolean
  options: Record<string, any>
  children: SchemaNode[]
}
```

### SchemaNode

```typescript
type SchemaNode = ContainerNode | FormItemNode

// 容器节点
interface ContainerNode {
  id: string
  type: 'Container'
  component: 'Block' | 'Container' | 'Form' | 'Row'
  display: boolean
  options: Record<string, any>
  children: SchemaNode[]
}

// 表单项节点
interface FormItemNode {
  id: string
  type: 'FormItem'
  component: FormItemComponent
  model: string              // 字段名
  span?: number              // 栅格占位
  required?: boolean         // 是否必填
  label: string              // 标签
  labelEn?: string           // 英文标签
  display: boolean
  options: Record<string, any>
}
```

## EventConfig 类型定义

```typescript
interface EventConfig {
  [model: string]: {
    [eventName: string]: EventAction[]
  }
}

interface EventAction {
  id: string
  target: string | 'self' | ''  // 目标控件
  method: EventMethod            // 动作方法
  props: Record<string, any>     // 方法参数
  description?: string
}

type EventMethod =
  | 'set'        // 设置属性
  | 'show'       // 显示
  | 'hide'       // 隐藏
  | 'enable'     // 启用
  | 'disable'    // 禁用
  | 'setValue'   // 设置值
  | 'map'        // 数据映射
  | 'call'       // 执行函数
  | 'reset'      // 重置
  | 'clearValidate'  // 清除校验
```

## 工具函数 API

### buildFormData

从 Schema 构建 FormData

```typescript
import { buildFormData } from '@/utils'

const formData = buildFormData(schema)
// 返回: { model1: '', model2: '', ... }
```

### getAllModels

获取 Schema 中所有表单项的 model

```typescript
import { getAllModels } from '@/utils'

const models = getAllModels(schema)
// 返回: ['model1', 'model2', ...]
```

### validateValue

校验单个值

```typescript
import { validateValue, commonPatterns } from '@/utils'

const result = validateValue('test@example.com', [
  { required: true, message: '邮箱必填' },
  { pattern: commonPatterns.email, message: '邮箱格式不正确' }
])

// 返回: { valid: true/false, message?: string }
```

## 错误处理

所有 API 请求可能返回以下错误码：

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

错误响应示例：

```json
{
  "code": 400,
  "message": "Form name is required",
  "data": null
}
```

## 更多信息

- [使用指南](./使用指南.md)
- [README](../README.md)
