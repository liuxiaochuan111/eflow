/**
 * Event Executor - 动态执行配置的事件处理代码
 */

// Safe execution of event handler code
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
    // Create a safe execution context
    const safeContext = {
      $component: context.component,
      $data: context.formData,
      $event: context.event,
      $args: context.args,
      console: console, // Allow console for debugging
      Math: Math,
      Date: Date,
      JSON: JSON
    }

    // Create function from code
    const func = new Function(
      '$component',
      '$data',
      '$event',
      '$args',
      'console',
      'Math',
      'Date',
      'JSON',
      code
    )

    // Execute with context
    return func(
      safeContext.$component,
      safeContext.$data,
      safeContext.$event,
      safeContext.$args,
      safeContext.console,
      safeContext.Math,
      safeContext.Date,
      safeContext.JSON
    )
  } catch (error) {
    console.error('Event execution error:', error)
    throw error
  }
}

// Bind events to a component
export function bindComponentEvents(
  component: any,
  events: Record<string, string>,
  formData: Record<string, any>
) {
  if (!events || !component) return

  Object.entries(events).forEach(([eventName, handlerCode]) => {
    if (!handlerCode) return

    // Remove existing listener
    component.$off(eventName)

    // Add new listener
    component.$on(eventName, (...args: any[]) => {
      const event = args[0] as Event

      executeEventHandler(handlerCode, {
        component,
        formData,
        event,
        args: args.slice(1)
      })
    })
  })
}

// Execute lifecycle events
export function executeLifecycleEvent(
  phase: 'mounted' | 'updated' | 'beforeUnmount',
  schemaNode: any,
  formData: Record<string, any>
) {
  const lifecycleEvents = schemaNode.lifecycleEvents || {}

  if (lifecycleEvents[phase]) {
    try {
      executeEventHandler(lifecycleEvents[phase], {
        component: null,
        formData,
        event: null as any,
        args: []
      })
    } catch (error) {
      console.error(`Lifecycle event error in ${phase}:`, error)
    }
  }
}
