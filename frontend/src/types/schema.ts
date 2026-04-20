/**
 * Schema 节点类型定义
 */

// 节点类型
export type SchemaNodeType = 'Container' | 'FormItem'

// 容器组件名称
export type ContainerComponent = 'Block' | 'Container' | 'Form' | 'Row'

// 表单项组件名称
export type FormItemComponent =
  | 'Input'
  | 'InputNumber'
  | 'Select'
  | 'DatePicker'
  | 'TimePicker'
  | 'Radio'
  | 'Checkbox'
  | 'Switch'
  | 'Slider'
  | 'Upload'
  | 'Cascader'
  | 'Textarea'
  | 'Table'
  | 'Rate'
  | 'ColorPicker'
  | 'Transfer'
  | 'TreeSelect'

// 基础 Schema 节点
export interface SchemaNode {
  id: string
  type: SchemaNodeType
  component: ContainerComponent | FormItemComponent
  display: boolean
  options: Record<string, any>
  children?: SchemaNode[]
}

// 容器节点
export interface ContainerNode extends SchemaNode {
  type: 'Container'
  component: ContainerComponent
  children: SchemaNode[]
}

// 表单项节点
export interface FormItemNode extends SchemaNode {
  type: 'FormItem'
  component: FormItemComponent
  model: string // 用于 v-model 绑定的字段名
  span?: number // 栅格占位（仅在 Row 中生效）
  required?: boolean
  label: string
  labelEn?: string
}

// Schema 树
export interface SchemaTree {
  type: 'Container'
  component: 'Container'
  display: boolean
  options: Record<string, any>
  children: SchemaNode[]
}

// 表单数据（从 Schema 自动生成）
export type FormData = Record<string, any>
