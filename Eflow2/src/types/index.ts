// 组件类型定义
export interface ComponentConfig {
  type: string
  name: string
  nameCn: string
  props: Record<string, PropConfig>
  events?: Record<string, EventConfig>
  methods?: Record<string, MethodConfig>
  father?: string[]
  defaultChild?: SchemaNode
}

export interface PropConfig {
  type: string
  title: string
  tooltip?: string
  required?: boolean
  default?: any
  options?: Array<{ label: string; value: any }>
  props?: Record<string, any>
  controlShow?: boolean
}

export interface EventConfig {
  label: string
  value: string
}

export interface MethodConfig {
  label: string
  value: string
}

// Schema节点类型
export interface SchemaNode {
  type: string
  label: string
  model: string
  display: boolean
  children?: SchemaNode[]
  component?: string
  span?: string | number
  required?: boolean
  options?: Record<string, any>
  title?: string
  disabled?: boolean
  labelEn?: string
  labelTips?: string
  url?: string
  formItemHandlers?: Record<string, string>
  eventHandlers?: Record<string, string>
  [key: string]: any
}

// 表单片段数据类型
export interface FormFragment {
  id?: number
  url: string
  label: string
  schema: SchemaNode[]
  eventConfig: EventConfigItem[]
  createdAt?: string
  updatedAt?: string
}

export interface EventConfigItem {
  componentName: string
  eventName: string
  handler: string
}

// 拖拽相关类型
export interface DragItem {
  type: string
  label: string
  isContainer: boolean
  father?: string[]
  icon?: any
}

// 编辑器状态类型
export interface EditorState {
  selectedComponent: SchemaNode | null
  schema: SchemaNode[]
  currentPageUrl: string
  currentLabel: string
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 列表查询参数
export interface ListQuery {
  page: number
  pageSize: number
  keyword?: string
}