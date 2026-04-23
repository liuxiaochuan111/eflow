/**
 * Event Executor - 动态执行配置的事件处理代码
 * 提供安全的事件执行环境，支持丰富的API和完善的错误处理
 */

/**
 * 危险代码模式检测
 * 检测并阻止可能导致安全风险的代码模式
 */
const DANGEROUS_PATTERNS = [
  /\bimport\s+/,
  /\brequire\s*\(/,
  /\beval\s*\(/,
  /\bFunction\s*\(/,
  /\bsetTimeout\s*\(/,
  /\bsetInterval\s*\(/,
  /document\./,
  /window\./,
  /\.\.\//,
  /__dirname/,
  /__filename/,
  /process\./,
  /child_process/,
  /fs\./,
  /\.\.prototype\./,
  /\.prototype\./,
  /constructor\s*\[/,
  /\['constructor'\]/,
  /\.call\s*\(/,
  /\.apply\s*\(/,
  /bind\s*\(/,
]

/**
 * 验证代码安全性
 * @param code 要验证的代码
 * @returns 如果代码安全返回true，否则抛出错误
 */
function validateCodeSafety(code: string): void {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      throw new Error(
        '代码包含不安全的操作。为了安全起见，不允许使用 import、require、eval、Function、setTimeout、setInterval 等危险操作。'
      )
    }
  }
}

/**
 * 创建安全的执行上下文
 * 提供丰富的API供事件处理代码使用
 */
function createSafeContext(context: {
  component: any
  formData: Record<string, any>
  event: Event
  args: any[]
}) {
  // 提取组件实例的方法（如果存在）
  const component = context.component || {}
  const messageApi = (component as any).message || {
    success: (msg: string) => console.log('[Message]', msg),
    warning: (msg: string) => console.warn('[Message]', msg),
    info: (msg: string) => console.info('[Message]', msg),
    error: (msg: string) => console.error('[Message]', msg),
  }
  const notificationApi = (component as any).notify || {
    success: (msg: string) => console.log('[Notification]', msg),
    warning: (msg: string) => console.warn('[Notification]', msg),
    info: (msg: string) => console.info('[Notification]', msg),
    error: (msg: string) => console.error('[Notification]', msg),
  }

  return {
    // 基础上下文
    $component: context.component,
    $data: context.formData,
    $event: context.event,
    $args: context.args,

    // 消息提示API
    $message: {
      success: (msg: string) => messageApi.success(msg),
      warning: (msg: string) => messageApi.warning(msg),
      info: (msg: string) => messageApi.info(msg),
      error: (msg: string) => messageApi.error(msg),
    },

    // 通知API
    $notify: {
      success: (msg: string) => notificationApi.success(msg),
      warning: (msg: string) => notificationApi.warning(msg),
      info: (msg: string) => notificationApi.info(msg),
      error: (msg: string) => notificationApi.error(msg),
    },

    // 表单字段操作API
    $setField: (field: string, value: any) => {
      if (context.formData && typeof field === 'string') {
        context.formData[field] = value
      }
    },

    $getField: (field: string) => {
      if (context.formData && typeof field === 'string') {
        return context.formData[field]
      }
      return undefined
    },

    // 允许的工具
    console: console,
    Math: Math,
    Date: Date,
    JSON: JSON,
    Object: Object,
    Array: Array,
    String: String,
    Number: Number,
    Boolean: Boolean,
  }
}

/**
 * 格式化错误信息，提供用户友好的错误消息
 */
function formatError(error: unknown, code: string): string {
  if (error instanceof Error) {
    // 隐藏技术栈信息，只提供有用的错误信息
    const message = error.message
    const lineMatch = message.match(/at line (\d+)/)
    const columnMatch = message.match(/at column (\d+)/)

    let formattedMessage = '事件执行错误: '

    if (lineMatch || columnMatch) {
      formattedMessage += `语法错误 `
      if (lineMatch) formattedMessage += `行 ${lineMatch[1]} `
      if (columnMatch) formattedMessage += `列 ${columnMatch[1]}`
      formattedMessage += '. 请检查代码语法是否正确。'
    } else if (message.includes('is not defined')) {
      const varMatch = message.match(/(\w+) is not defined/)
      if (varMatch) {
        formattedMessage += `变量 "${varMatch[1]}" 未定义。请检查变量名是否正确。`
      } else {
        formattedMessage += '变量未定义。请检查代码中的变量名。'
      }
    } else if (message.includes('is not a function')) {
      formattedMessage += '尝试调用的方法不存在。请检查方法名是否正确。'
    } else if (message.includes('Cannot read')) {
      formattedMessage += '无法读取属性或方法。请检查对象是否正确。'
    } else {
      formattedMessage += message
    }

    return formattedMessage
  }

  return '事件执行时发生未知错误'
}

/**
 * 安全执行事件处理代码
 * @param code 要执行的代码
 * @param context 执行上下文
 * @returns 执行结果
 * @throws 如果代码不安全或执行失败，抛出友好的错误信息
 */
export function executeEventHandler(
  code: string,
  context: {
    component: any
    formData: Record<string, any>
    event: Event
    args: any[]
  }
): any {
  try {
    // 验证代码安全性
    validateCodeSafety(code)

    // 创建安全的执行上下文
    const safeContext = createSafeContext(context)

    // 创建函数
    const func = new Function(
      '$component',
      '$data',
      '$event',
      '$args',
      '$message',
      '$notify',
      '$setField',
      '$getField',
      'console',
      'Math',
      'Date',
      'JSON',
      'Object',
      'Array',
      'String',
      'Number',
      'Boolean',
      code
    )

    // 执行函数
    return func(
      safeContext.$component,
      safeContext.$data,
      safeContext.$event,
      safeContext.$args,
      safeContext.$message,
      safeContext.$notify,
      safeContext.$setField,
      safeContext.$getField,
      safeContext.console,
      safeContext.Math,
      safeContext.Date,
      safeContext.JSON,
      safeContext.Object,
      safeContext.Array,
      safeContext.String,
      safeContext.Number,
      safeContext.Boolean
    )
  } catch (error) {
    const formattedError = formatError(error, code)
    console.error('[EventExecutor]', formattedError, { code, error })
    throw new Error(formattedError)
  }
}

/**
 * 绑定事件到组件
 * @param component 组件实例
 * @param events 事件配置对象 { eventName: handlerCode }
 * @param formData 表单数据
 */
export function bindComponentEvents(
  component: any,
  events: Record<string, string>,
  formData: Record<string, any>
): void {
  if (!events || !component) {
    console.warn('[EventExecutor] Cannot bind events: missing events or component')
    return
  }

  Object.entries(events).forEach(([eventName, handlerCode]) => {
    if (!handlerCode || typeof handlerCode !== 'string') {
      return
    }

    try {
      // 移除已存在的监听器
      if (typeof component.$off === 'function') {
        component.$off(eventName)
      }

      // 添加新的监听器
      if (typeof component.$on === 'function') {
        component.$on(eventName, (...args: any[]) => {
          const event = args[0] as Event

          try {
            executeEventHandler(handlerCode, {
              component,
              formData,
              event,
              args: args.slice(1)
            })
          } catch (error) {
            // 在事件处理错误时显示用户友好的消息
            console.error(`[EventExecutor] Error in event "${eventName}":`, error)
            const messageApi = (component as any)?.message
            if (messageApi && typeof messageApi.error === 'function') {
              messageApi.error('事件执行失败，请检查配置')
            }
          }
        })
      }
    } catch (error) {
      console.error(`[EventExecutor] Failed to bind event "${eventName}":`, error)
    }
  })
}

/**
 * 执行生命周期事件
 * @param phase 生命周期阶段
 * @param schemaNode schema节点
 * @param formData 表单数据
 * @returns 执行是否成功
 */
export function executeLifecycleEvent(
  phase: 'mounted' | 'updated' | 'beforeUnmount',
  schemaNode: any,
  formData: Record<string, any>
): boolean {
  if (!schemaNode) {
    console.warn(`[EventExecutor] Cannot execute lifecycle event: missing schemaNode`)
    return false
  }

  const lifecycleEvents = schemaNode.lifecycleEvents || {}

  if (lifecycleEvents[phase]) {
    try {
      executeEventHandler(lifecycleEvents[phase], {
        component: null,
        formData,
        event: null as any,
        args: []
      })
      return true
    } catch (error) {
      const formattedError = error instanceof Error ? error.message : String(error)
      console.error(
        `[EventExecutor] Lifecycle event error in "${phase}":`,
        formattedError
      )
      return false
    }
  }

  return true
}

/**
 * 验证事件代码是否安全
 * @param code 要验证的代码
 * @returns 如果代码安全返回true，否则返回false
 */
export function validateEventCode(code: string): { valid: boolean; error?: string } {
  try {
    validateCodeSafety(code)
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '代码验证失败'
    }
  }
}

/**
 * 导出类型定义
 */
export type EventContext = {
  component: any
  formData: Record<string, any>
  event: Event
  args: any[]
}

export type LifecyclePhase = 'mounted' | 'updated' | 'beforeUnmount'
