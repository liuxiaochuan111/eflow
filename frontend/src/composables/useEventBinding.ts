/**
 * 事件绑定 Composable
 */

import { ref } from 'vue'
import type { EventConfig, EventAction, EventContext, EventResult } from '@/types'

export function useEventBinding(initialEventConfig?: EventConfig) {
  const eventConfig = ref<EventConfig>(initialEventConfig || {})

  // 获取控件的事件配置
  const getControlEvents = (model: string) => {
    return eventConfig.value[model] || {}
  }

  // 添加事件动作
  const addEventAction = (model: string, eventName: string, action: EventAction) => {
    if (!eventConfig.value[model]) {
      eventConfig.value[model] = {}
    }
    if (!eventConfig.value[model][eventName]) {
      eventConfig.value[model][eventName] = []
    }
    eventConfig.value[model][eventName].push(action)
  }

  // 删除事件动作
  const removeEventAction = (model: string, eventName: string, actionId: string) => {
    if (eventConfig.value[model]?.[eventName]) {
      const index = eventConfig.value[model][eventName].findIndex((a) => a.id === actionId)
      if (index > -1) {
        eventConfig.value[model][eventName].splice(index, 1)
      }
    }
  }

  // 更新事件动作
  const updateEventAction = (model: string, eventName: string, action: EventAction) => {
    if (eventConfig.value[model]?.[eventName]) {
      const index = eventConfig.value[model][eventName].findIndex((a) => a.id === action.id)
      if (index > -1) {
        eventConfig.value[model][eventName][index] = action
      }
    }
  }

  // 执行事件联动
  const executeEvent = async (
    model: string,
    eventName: string,
    context: EventContext
  ): Promise<EventResult> => {
    const events = eventConfig.value[model]?.[eventName]
    if (!events || events.length === 0) {
      return { success: true }
    }

    const changedModels: string[] = []

    try {
      for (const action of events) {
        const result = await executeAction(action, context)
        if (result.success && result.changedModels) {
          changedModels.push(...result.changedModels)
        } else if (!result.success) {
          return result
        }
      }

      return { success: true, changedModels }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // 执行单个动作
  const executeAction = async (action: EventAction, context: EventContext): Promise<EventResult> => {
    const { target, method, props } = action
    const { formData, State, customFuncs } = context

    switch (method) {
      case 'set':
        return executeSetAction(target, props, formData, State)
      case 'show':
        return executeSetAction(target, { prop: 'display', value: true }, formData, State)
      case 'hide':
        return executeSetAction(target, { prop: 'display', value: false }, formData, State)
      case 'enable':
        return executeSetAction(target, { prop: 'disabled', value: false }, formData, State)
      case 'disable':
        return executeSetAction(target, { prop: 'disabled', value: true }, formData, State)
      case 'setValue':
        return executeSetValueAction(target, props.value, formData, State)
      case 'map':
        return executeMapAction(target, props.source, formData, State)
      case 'call':
        return executeCallAction(props.functionName, props.args, customFuncs)
      case 'reset':
        return executeResetAction(target, formData)
      case 'clearValidate':
        return { success: true }
      default:
        return { success: false, error: `Unknown method: ${method}` }
    }
  }

  // 执行设置属性动作
  const executeSetAction = (
    target: string,
    _props: any,
    _formData: any,
    _State?: any
  ): EventResult => {
    // 这里需要通过某种方式通知外部更新 schema
    // 实际实现中，可以通过事件或回调来处理
    return { success: true, changedModels: [target] }
  }

  // 执行设置值动作
  const executeSetValueAction = (target: string, value: any, formData: any, State?: any): EventResult => {
    // 解析表达式
    let finalValue = value
    if (typeof value === 'string' && value.includes('formData.')) {
      finalValue = evaluateExpression(value, { formData, State })
    }

    formData[target] = finalValue
    return { success: true, changedModels: [target] }
  }

  // 执行数据映射动作
  const executeMapAction = (target: string, source: string, formData: any, State?: any): EventResult => {
    let sourceValue
    if (source.startsWith('State.')) {
      const stateKey = source.replace('State.', '')
      sourceValue = State?.[stateKey]
    } else if (source.startsWith('formData.')) {
      const formKey = source.replace('formData.', '')
      sourceValue = formData[formKey]
    } else {
      sourceValue = evaluateExpression(source, { formData, State })
    }

    formData[target] = sourceValue
    return { success: true, changedModels: [target] }
  }

  // 执行函数调用动作
  const executeCallAction = (
    functionName: string,
    args: any,
    customFuncs?: Record<string, Function>
  ): EventResult => {
    if (!customFuncs || !customFuncs[functionName]) {
      return { success: false, error: `Function not found: ${functionName}` }
    }

    try {
      const parsedArgs = args ? JSON.parse(args) : []
      customFuncs[functionName](...parsedArgs)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // 执行重置动作
  const executeResetAction = (target: string, formData: any): EventResult => {
    if (target === '' || target === 'self') {
      // 重置所有
      Object.keys(formData).forEach((key) => {
        formData[key] = undefined
      })
    } else {
      formData[target] = undefined
    }
    return { success: true, changedModels: target === '' ? undefined : [target] }
  }

  // 简单的表达式求值
  const evaluateExpression = (expression: string, context: any): any => {
    try {
      // 这里简化处理，实际应该使用更安全的表达式解析器
      const func = new Function('formData', 'State', `return ${expression}`)
      return func(context.formData, context.State)
    } catch {
      return expression
    }
  }

  // 生成事件动作 ID
  const generateActionId = (): string => {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  return {
    eventConfig,
    getControlEvents,
    addEventAction,
    removeEventAction,
    updateEventAction,
    executeEvent,
    generateActionId
  }
}
