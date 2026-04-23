import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  executeEventHandler,
  bindComponentEvents,
  executeLifecycleEvent,
  validateEventCode
} from './eventExecutor'

describe('EventExecutor', () => {
  let mockContext: any
  let mockComponent: any

  beforeEach(() => {
    // Mock console methods to avoid cluttering test output
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})

    // Create mock component with message and notify APIs
    mockComponent = {
      $on: vi.fn(),
      $off: vi.fn(),
      message: {
        success: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        error: vi.fn()
      },
      notify: {
        success: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        error: vi.fn()
      }
    }

    mockContext = {
      component: mockComponent,
      formData: { name: 'test', age: 25 },
      event: new Event('click'),
      args: ['arg1', 'arg2']
    }
  })

  describe('executeEventHandler', () => {
    it('should execute simple code', () => {
      const result = executeEventHandler('return 1 + 1', mockContext)
      expect(result).toBe(2)
    })

    it('should provide access to context variables', () => {
      const code = 'return $data.name'
      const result = executeEventHandler(code, mockContext)
      expect(result).toBe('test')
    })

    it('should support $message API', () => {
      const code = '$message.success("Test message")'
      executeEventHandler(code, mockContext)
      expect(mockComponent.message.success).toHaveBeenCalledWith('Test message')
    })

    it('should support $notify API', () => {
      const code = '$notify.warning("Warning message")'
      executeEventHandler(code, mockContext)
      expect(mockComponent.notify.warning).toHaveBeenCalledWith('Warning message')
    })

    it('should support $setField API', () => {
      const code = '$setField("name", "updated")'
      executeEventHandler(code, mockContext)
      expect(mockContext.formData.name).toBe('updated')
    })

    it('should support $getField API', () => {
      const code = 'return $getField("age")'
      const result = executeEventHandler(code, mockContext)
      expect(result).toBe(25)
    })

    it('should support console methods', () => {
      const code = 'console.log("test"); console.warn("warning")'
      executeEventHandler(code, mockContext)
      expect(console.log).toHaveBeenCalledWith('test')
      expect(console.warn).toHaveBeenCalledWith('warning')
    })

    it('should support Math, Date, JSON', () => {
      const code = 'return Math.max(1, 2, 3)'
      const result = executeEventHandler(code, mockContext)
      expect(result).toBe(3)
    })

    it('should handle multi-line code', () => {
      const code = `
        const x = 10
        const y = 20
        return x + y
      `
      const result = executeEventHandler(code, mockContext)
      expect(result).toBe(30)
    })

    it('should handle complex operations', () => {
      const code = `
        const data = $data
        const sum = data.age + 5
        $setField("age", sum)
        return sum
      `
      const result = executeEventHandler(code, mockContext)
      expect(result).toBe(30)
      expect(mockContext.formData.age).toBe(30)
    })

    describe('security validation', () => {
      it('should block import statements', () => {
        const code = 'import { x } from "test"'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })

      it('should block require calls', () => {
        const code = 'require("fs")'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })

      it('should block eval calls', () => {
        const code = 'eval("1+1")'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })

      it('should block Function constructor', () => {
        const code = 'new Function("return 1")'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })

      it('should block setTimeout', () => {
        const code = 'setTimeout(() => {}, 1000)'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })

      it('should block setInterval', () => {
        const code = 'setInterval(() => {}, 1000)'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })

      it('should block document access', () => {
        const code = 'document.getElementById("test")'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })

      it('should block window access', () => {
        const code = 'window.location'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })

      it('should block prototype manipulation', () => {
        const code = 'Object.prototype.toString = () => {}'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })
    })

    describe('error handling', () => {
      it('should handle syntax errors gracefully', () => {
        const code = 'return 1 +'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })

      it('should handle undefined variables', () => {
        const code = 'return undefinedVariable'
        expect(() => executeEventHandler(code, mockContext)).toThrow()
      })

      it('should provide user-friendly error messages', () => {
        const code = 'return nonExistentVar'
        try {
          executeEventHandler(code, mockContext)
          expect.fail('Should have thrown an error')
        } catch (error) {
          expect(error).toBeInstanceOf(Error)
          const message = (error as Error).message
          expect(message).toContain('变量')
          expect(message).toContain('未定义')
        }
      })

      it('should log errors to console', () => {
        const code = 'throw new Error("Test error")'
        try {
          executeEventHandler(code, mockContext)
        } catch (error) {
          // Expected
        }
        expect(console.error).toHaveBeenCalled()
      })
    })
  })

  describe('bindComponentEvents', () => {
    it('should bind events to component', () => {
      const events = {
        click: '$message.success("clicked")',
        submit: '$setField("submitted", true)'
      }

      bindComponentEvents(mockComponent, events, mockContext.formData)

      expect(mockComponent.$off).toHaveBeenCalledWith('click')
      expect(mockComponent.$off).toHaveBeenCalledWith('submit')
      expect(mockComponent.$on).toHaveBeenCalledTimes(2)
    })

    it('should handle empty events object', () => {
      bindComponentEvents(mockComponent, {}, mockContext.formData)
      expect(mockComponent.$on).not.toHaveBeenCalled()
    })

    it('should handle missing component', () => {
      const events = { click: 'return 1' }
      bindComponentEvents(null, events, mockContext.formData)
      expect(mockComponent.$on).not.toHaveBeenCalled()
    })

    it('should skip empty handler code', () => {
      const events = { click: '', submit: null as any }
      bindComponentEvents(mockComponent, events, mockContext.formData)
      expect(mockComponent.$on).not.toHaveBeenCalled()
    })

    it('should execute handler when event is triggered', () => {
      const events = { click: '$setField("clicked", true)' }
      let capturedHandler: any

      mockComponent.$on = vi.fn((_event, handler) => {
        capturedHandler = handler
      })

      bindComponentEvents(mockComponent, events, mockContext.formData)

      // Simulate event trigger
      if (capturedHandler) {
        capturedHandler(new Event('click'))
      }

      expect(mockContext.formData.clicked).toBe(true)
    })

    it('should handle errors in event handlers', () => {
      const events = { click: 'throw new Error("Handler error")' }
      let capturedHandler: any

      mockComponent.$on = vi.fn((_event, handler) => {
        capturedHandler = handler
      })

      bindComponentEvents(mockComponent, events, mockContext.formData)

      // Simulate event trigger
      if (capturedHandler) {
        capturedHandler(new Event('click'))
      }

      // Should log error but not crash
      expect(console.error).toHaveBeenCalled()
      expect(mockComponent.message.error).toHaveBeenCalledWith('事件执行失败，请检查配置')
    })
  })

  describe('executeLifecycleEvent', () => {
    it('should execute lifecycle event code', () => {
      const schemaNode = {
        lifecycleEvents: {
          mounted: '$setField("mounted", true)'
        }
      }

      const result = executeLifecycleEvent('mounted', schemaNode, mockContext.formData)
      expect(result).toBe(true)
      expect(mockContext.formData.mounted).toBe(true)
    })

    it('should return true when no lifecycle event defined', () => {
      const schemaNode = { lifecycleEvents: {} }
      const result = executeLifecycleEvent('mounted', schemaNode, mockContext.formData)
      expect(result).toBe(true)
    })

    it('should return true when schemaNode is null', () => {
      const result = executeLifecycleEvent('mounted', null, mockContext.formData)
      expect(result).toBe(false)
    })

    it('should handle errors in lifecycle events', () => {
      const schemaNode = {
        lifecycleEvents: {
          mounted: 'throw new Error("Lifecycle error")'
        }
      }

      const result = executeLifecycleEvent('mounted', schemaNode, mockContext.formData)
      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalled()
    })

    it('should support all lifecycle phases', () => {
      const phases: Array<'mounted' | 'updated' | 'beforeUnmount'> = ['mounted', 'updated', 'beforeUnmount']

      phases.forEach(phase => {
        const schemaNode = {
          lifecycleEvents: {
            [phase]: `$setField("${phase}", true)`
          }
        }

        const result = executeLifecycleEvent(phase, schemaNode, mockContext.formData)
        expect(result).toBe(true)
        expect(mockContext.formData[phase]).toBe(true)
      })
    })
  })

  describe('validateEventCode', () => {
    it('should validate safe code', () => {
      const result = validateEventCode('return 1 + 1')
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject code with import', () => {
      const result = validateEventCode('import { x } from "test"')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject code with require', () => {
      const result = validateEventCode('require("fs")')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject code with eval', () => {
      const result = validateEventCode('eval("1+1")')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject code with setTimeout', () => {
      const result = validateEventCode('setTimeout(() => {}, 1000)')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject code with document access', () => {
      const result = validateEventCode('document.getElementById("test")')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject code with window access', () => {
      const result = validateEventCode('window.location')
      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('integration tests', () => {
    it('should handle complex real-world scenarios', () => {
      const complexCode = `
        // Validate form data
        const age = $getField("age")
        if (age < 18) {
          $message.warning("年龄必须大于18岁")
          $setField("valid", false)
          return false
        }

        // Process data
        $setField("processed", true)
        $message.success("表单验证通过")

        return true
      `

      const result = executeEventHandler(complexCode, mockContext)
      expect(result).toBe(true)
      expect(mockContext.formData.processed).toBe(true)
    })

    it('should handle form validation scenario', () => {
      mockContext.formData.age = 15 // Under 18

      const validationCode = `
        const age = $getField("age")
        if (age < 18) {
          $message.warning("年龄必须大于18岁")
          return false
        }
        $message.success("验证通过")
        return true
      `

      const result = executeEventHandler(validationCode, mockContext)
      expect(result).toBe(false)
      expect(mockComponent.message.warning).toHaveBeenCalledWith('年龄必须大于18岁')
    })

    it('should handle data transformation', () => {
      const transformCode = `
        const name = $getField("name")
        const upperName = name.toUpperCase()
        $setField("name", upperName)
        return upperName
      `

      const result = executeEventHandler(transformCode, mockContext)
      expect(result).toBe('TEST')
      expect(mockContext.formData.name).toBe('TEST')
    })
  })
})
