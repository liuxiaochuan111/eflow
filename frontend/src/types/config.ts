/**
 * 配置清单类型定义
 */

import type { ContainerComponent, FormItemComponent } from './schema'

// 属性配置类型
export interface PropConfig {
  component: string // 用于渲染属性配置的组件类型
  default: any // 默认值
  required?: boolean // 是否必填
  type?: 'String' | 'Number' | 'Boolean' | 'Array' | 'Object' // 属性值类型
  options?: any[] // 选项（用于 Select、Radio 等）
  min?: number // 最小值
  max?: number // 最大值
  step?: number // 步长
  precision?: number // 精度
  placeholder?: string
  label?: string
  description?: string // 属性描述
}

// 容器配置项
export interface ContainerConfig {
  type: 'Container'
  name: ContainerComponent
  label: string
  labelEn?: string
  icon: string
  props: Record<string, PropConfig>
  father: (ContainerComponent | '')[] // 可以放置的父容器
  defaultOptions?: Record<string, any> // 默认选项
}

// 表单项配置项
export interface FormItemConfig {
  type: 'FormItem'
  name: FormItemComponent
  label: string
  labelEn?: string
  icon: string
  props: Record<string, PropConfig>
  events: string[] // 支持的事件列表
  father: (ContainerComponent | '')[] // 可以放置的父容器
  slots: Record<string, string> // 支持的插槽
  defaultOptions?: Record<string, any> // 默认选项
}

// 配置清单
export interface ConfigRegistry {
  containers: ContainerConfig[]
  formItems: FormItemConfig[]
}
