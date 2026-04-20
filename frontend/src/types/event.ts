/**
 * 事件系统类型定义
 */

// 事件动作方法类型
export type EventMethod = 'set' | 'call' | 'map' | 'show' | 'hide' | 'enable' | 'disable' | 'setValue' | 'reset' | 'clearValidate'

// 事件目标类型
export type EventTarget = string | 'self' | ''

// 事件动作配置
export interface EventAction {
  id: string
  target: EventTarget // 目标控件的 model，'self' 表示自身，空字符串表示全局
  method: EventMethod // 动作方法
  props: Record<string, any> // 方法参数
  description?: string // 动作描述
}

// 单个控件的事件配置
export interface ControlEventConfig {
  [eventName: string]: EventAction[] // 事件名 -> 动作列表
}

// 整个表单的事件配置
export interface EventConfig {
  [model: string]: ControlEventConfig // model -> 事件配置
}

// 事件上下文（执行事件时的上下文信息）
export interface EventContext {
  formData: Record<string, any> // 表单数据
  State?: Record<string, any> // 外部传入的状态对象
  customFuncs?: Record<string, Function> // 自定义函数
  currentModel: string // 当前触发事件的控件 model
  currentEvent: string // 当前触发的事件名
}

// 事件执行结果
export interface EventResult {
  success: boolean
  error?: string
  changedModels?: string[] // 被修改的 model 列表
}
