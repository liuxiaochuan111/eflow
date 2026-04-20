/**
 * Schema 节点类型
 */
export interface SchemaNode {
  id: string
  type: 'Container' | 'FormItem'
  component: string
  display: boolean
  options: Record<string, any>
  model?: string
  label?: string
  required?: boolean
  children?: SchemaNode[]
}

/**
 * Schema 树类型
 */
export interface SchemaTree extends SchemaNode {
  children: SchemaNode[]
}

/**
 * 事件配置
 */
export interface EventConfig {
  [key: string]: {
    [eventName: string]: EventAction[]
  }
}

/**
 * 事件动作
 */
export interface EventAction {
  target: string
  method: 'set' | 'call' | 'map'
  props: Record<string, any>
}

/**
 * 表单数据
 */
export interface FormMetadata {
  id: string
  name: string
  schema: SchemaTree
  eventConfig: EventConfig
  createdAt: string
  updatedAt: string
}

/**
 * API 响应
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
