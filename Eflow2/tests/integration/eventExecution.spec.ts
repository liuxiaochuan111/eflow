import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import SchemaNodeRenderer from '../../src/components/SchemaNodeRenderer.vue'
import { executeEventHandler } from '../../src/utils/eventExecutor'
import type { SchemaNode } from '../../src/types'

/**
 * Integration Tests for Event Execution
 *
 * These tests verify end-to-end event execution functionality using direct event testing
 */

describe('Event Execution Integration Tests', () => {
  let mockFormData: Record<string, any>

  beforeEach(() => {
    // Mock console methods to track output
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})

    // Initialize mock form data
    mockFormData = {
      username: '',
      email: '',
      age: 0,
      validated: false,
      processed: false
    }
  })

  describe('Direct Event Handler Testing', () => {
    it('should execute blur event handler directly', () => {
      const handlerCode = `
        console.log('Blur triggered')
        $setField('validated', true)
      `

      mockFormData.username = 'testuser'

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('blur'),
        args: []
      })

      expect(console.log).toHaveBeenCalledWith('Blur triggered')
      expect(mockFormData.validated).toBe(true)
    })

    it('should execute change event handler directly', () => {
      const handlerCode = `
        console.log('Change triggered')
        $setField('processed', true)
      `

      mockFormData.email = 'test@example.com'

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('change'),
        args: []
      })

      expect(console.log).toHaveBeenCalledWith('Change triggered')
      expect(mockFormData.processed).toBe(true)
    })
  })

  describe('Form Data Manipulation', () => {
    it('should read and modify form data in events', () => {
      const handlerCode = `
        const username = $getField('username')
        console.log('Username:', username)
        $setField('username', username.toUpperCase())
        $setField('validated', true)
      `

      mockFormData.username = 'testuser'

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('blur'),
        args: []
      })

      expect(console.log).toHaveBeenCalledWith('Username:', 'testuser')
      expect(mockFormData.username).toBe('TESTUSER')
      expect(mockFormData.validated).toBe(true)
    })

    it('should support conditional logic in events', () => {
      // Test underage
      mockFormData.age = 15

      const handlerCode = `
        const age = $getField('age')
        if (age < 18) {
          console.log('Underage')
          $setField('validated', false)
        } else {
          console.log('Adult')
          $setField('validated', true)
        }
      `

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('change'),
        args: []
      })

      expect(console.log).toHaveBeenCalledWith('Underage')
      expect(mockFormData.validated).toBe(false)

      // Test adult
      mockFormData.age = 25

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('change'),
        args: []
      })

      expect(console.log).toHaveBeenCalledWith('Adult')
      expect(mockFormData.validated).toBe(true)
    })

    it('should perform complex calculations', () => {
      mockFormData = {
        price: 100,
        quantity: 5,
        total: 0
      }

      const handlerCode = `
        const price = $getField('price')
        const quantity = $getField('quantity')
        const total = price * quantity

        $setField('total', total)
        console.log('Total calculated:', total)
      `

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('change'),
        args: []
      })

      expect(mockFormData.total).toBe(500)
      expect(console.log).toHaveBeenCalledWith('Total calculated:', 500)
    })

    it('should validate multiple fields', () => {
      mockFormData = {
        password: 'secret123',
        confirmPassword: 'secret123',
        passwordMatch: false
      }

      const handlerCode = `
        const password = $getField('password')
        const confirm = $getField('confirmPassword')

        if (password === confirm) {
          console.log('Passwords match')
          $setField('passwordMatch', true)
        } else {
          console.log('Passwords do not match')
          $setField('passwordMatch', false)
        }
      `

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('blur'),
        args: []
      })

      expect(console.log).toHaveBeenCalledWith('Passwords match')
      expect(mockFormData.passwordMatch).toBe(true)

      // Test mismatch
      mockFormData.confirmPassword = 'different'
      mockFormData.passwordMatch = false

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('blur'),
        args: []
      })

      expect(console.log).toHaveBeenCalledWith('Passwords do not match')
      expect(mockFormData.passwordMatch).toBe(false)
    })
  })

  describe('Complex Event Scenarios', () => {
    it('should handle email validation with regex', () => {
      const handlerCode = `
        const email = $getField('email')
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/

        if (email && !emailRegex.test(email)) {
          console.warn('Invalid email format')
          $setField('validated', false)
        } else if (email) {
          console.log('Valid email')
          $setField('validated', true)
        }
      `

      // Test invalid email
      mockFormData.email = 'invalid-email'

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('blur'),
        args: []
      })

      expect(console.warn).toHaveBeenCalledWith('Invalid email format')
      expect(mockFormData.validated).toBe(false)

      // Test valid email
      mockFormData.email = 'test@example.com'

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('blur'),
        args: []
      })

      expect(console.log).toHaveBeenCalledWith('Valid email')
      expect(mockFormData.validated).toBe(true)
    })

    it('should transform data in events', () => {
      mockFormData.email = 'user@example.com'

      const handlerCode = `
        const email = $getField('email')
        if (email) {
          const domain = email.split('@')[1]
          $setField('emailDomain', domain)
          $setField('processed', true)
          console.log('Email domain extracted:', domain)
        }
      `

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('change'),
        args: []
      })

      expect(mockFormData.emailDomain).toBe('example.com')
      expect(mockFormData.processed).toBe(true)
      expect(console.log).toHaveBeenCalledWith('Email domain extracted:', 'example.com')
    })

    it('should handle complex conditional logic', () => {
      mockFormData = {
        country: 'USA',
        requiresState: false
      }

      const handlerCode = `
        const country = $getField('country')

        if (country === 'USA' || country === 'Canada') {
          $setField('requiresState', true)
          console.log('State required for:', country)
        } else if (country === 'UK') {
          $setField('requiresState', false)
          console.log('Postcode required for UK')
        } else {
          $setField('requiresState', false)
        }
      `

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('change'),
        args: []
      })

      expect(mockFormData.requiresState).toBe(true)
      expect(console.log).toHaveBeenCalledWith('State required for:', 'USA')

      // Test UK
      mockFormData.country = 'UK'

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('change'),
        args: []
      })

      expect(mockFormData.requiresState).toBe(false)
      expect(console.log).toHaveBeenCalledWith('Postcode required for UK')
    })
  })

  describe('Error Handling', () => {
    it('should handle runtime errors gracefully', () => {
      const handlerCode = `
        // This will cause an error
        const x = undefinedVariable
      `

      mockFormData.username = 'testuser'

      expect(() => {
        executeEventHandler(handlerCode, {
          component: null,
          formData: mockFormData,
          event: new Event('blur'),
          args: []
        })
      }).toThrow()

      // Error should be logged
      expect(console.error).toHaveBeenCalled()
    })

    it('should continue execution after recoverable errors', () => {
      const handlerCode = `
        console.log('Starting')
        const email = $getField('email')

        if (!email) {
          console.warn('Email empty')
          return
        }

        $setField('processed', true)
        console.log('Done')
      `

      mockFormData.email = 'test@example.com'

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('blur'),
        args: []
      })

      expect(console.log).toHaveBeenCalledWith('Starting')
      expect(console.log).toHaveBeenCalledWith('Done')
      expect(mockFormData.processed).toBe(true)
    })

    it('should provide user-friendly error messages', () => {
      const handlerCode = `
        return nonExistentVariable
      `

      mockFormData.username = 'testuser'

      try {
        executeEventHandler(handlerCode, {
          component: null,
          formData: mockFormData,
          event: new Event('blur'),
          args: []
        })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        const message = (error as Error).message
        expect(message).toContain('变量')
        expect(message).toContain('未定义')
      }
    })
  })

  describe('Real-World Scenarios', () => {
    it('should handle form submission validation', () => {
      mockFormData = {
        username: 'testuser',
        email: 'test@example.com',
        age: 25,
        formValid: false
      }

      const handlerCode = `
        const username = $getField('username')
        const email = $getField('email')
        const age = $getField('age')

        if (!username || !email || !age) {
          console.warn('Please fill all fields')
          $setField('formValid', false)
          return
        }

        if (age < 18) {
          console.warn('Must be 18 or older')
          $setField('formValid', false)
          return
        }

        console.log('Form validation successful')
        $setField('formValid', true)
      `

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('submit'),
        args: []
      })

      expect(console.log).toHaveBeenCalledWith('Form validation successful')
      expect(mockFormData.formValid).toBe(true)
    })

    it('should handle dynamic field updates', () => {
      mockFormData = {
        firstName: 'John',
        lastName: 'Doe',
        fullName: ''
      }

      const handlerCode = `
        const firstName = $getField('firstName')
        const lastName = $getField('lastName')
        const fullName = firstName + ' ' + lastName

        $setField('fullName', fullName)
        console.log('Full name:', fullName)
      `

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('blur'),
        args: []
      })

      expect(mockFormData.fullName).toBe('John Doe')
      expect(console.log).toHaveBeenCalledWith('Full name:', 'John Doe')
    })

    it('should handle array operations', () => {
      mockFormData = {
        items: [1, 2, 3],
        total: 0
      }

      const handlerCode = `
        const items = $getField('items')
        const total = items.reduce((sum, item) => sum + item, 0)

        $setField('total', total)
        console.log('Total calculated:', total)
      `

      executeEventHandler(handlerCode, {
        component: null,
        formData: mockFormData,
        event: new Event('change'),
        args: []
      })

      expect(mockFormData.total).toBe(6)
      expect(console.log).toHaveBeenCalledWith('Total calculated:', 6)
    })
  })

  describe('Component Integration Tests', () => {
    it('should render component with event handlers', () => {
      const schemaNode: SchemaNode = {
        type: 'Input',
        label: 'Username',
        model: 'username',
        eventHandlers: {
          blur: `console.log('Blur event')`
        }
      }

      mockFormData.username = 'testuser'

      const wrapper = mount(SchemaNodeRenderer, {
        props: {
          node: schemaNode,
          modelValue: mockFormData
        }
      })

      // Verify component rendered
      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.element.value).toBe('testuser')
    })

    it('should render FormItem with child component events', () => {
      const schemaNode: SchemaNode = {
        type: 'FormItem',
        label: 'User Info',
        model: 'username',
        children: [
          {
            type: 'Input',
            label: 'Username',
            model: 'username',
            eventHandlers: {
              blur: `console.log('FormItem blur')`
            }
          }
        ]
      }

      mockFormData.username = 'testuser'

      const wrapper = mount(SchemaNodeRenderer, {
        props: {
          node: schemaNode,
          modelValue: mockFormData
        }
      })

      // Verify component rendered
      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.element.value).toBe('testuser')
    })
  })
})
