/**
 * Schema Parser 工具函数单元测试
 */

import { describe, it, expect } from 'vitest'
import { buildFormData, validateSchema, cloneSchema } from '@/utils/schema-parser'
import type { SchemaTree } from '@/types'

describe('Schema Parser', () => {
  describe('buildFormData', () => {
    it('应该能从空schema构建空formData', () => {
      const schema: SchemaTree = {
        id: 'root',
        type: 'Container',
        component: 'Container',
        display: true,
        options: {},
        children: []
      }
      
      const formData = buildFormData(schema)
      
      expect(formData).toEqual({})
    })

    it('应该能从schema构建formData', () => {
      const schema: SchemaTree = {
        id: 'root',
        type: 'Container',
        component: 'Container',
        display: true,
        options: {},
        children: [
          {
            id: 'root',
            type: 'Container',
            component: 'Form',
            display: true,
            options: {},
            children: [
              {
                id: 'input_1',
                type: 'FormItem',
                component: 'Input',
                model: 'username',
                display: true,
                options: {}
              },
              {
                id: 'input_2',
                type: 'FormItem',
                component: 'Input',
                model: 'email',
                display: true,
                options: {}
              }
            ]
          }
        ]
      }
      
      const formData = buildFormData(schema)
      
      expect(formData).toEqual({
        username: '',
        email: ''
      })
    })

    it('应该处理嵌套结构', () => {
      const schema: SchemaTree = {
        id: 'root',
        type: 'Container',
        component: 'Container',
        display: true,
        options: {},
        children: [
          {
            id: 'form_1',
            type: 'Container',
            component: 'Form',
            display: true,
            options: {},
            children: [
              {
                id: 'row_1',
                type: 'Container',
                component: 'Row',
                display: true,
                options: {},
                children: [
                  {
                    id: 'input_1',
                    type: 'FormItem',
                    component: 'Input',
                    model: 'field1',
                    display: true,
                    options: {}
                  }
                ]
              }
            ]
          }
        ]
      }
      
      const formData = buildFormData(schema)
      
      expect(formData).toEqual({
        field1: ''
      })
    })

    it('应该忽略没有model的表单项', () => {
      const schema: SchemaTree = {
        id: 'root',
        type: 'Container',
        component: 'Container',
        display: true,
        options: {},
        children: [
          {
            id: 'input_1',
            type: 'FormItem',
            component: 'Input',
            model: 'username',
            display: true,
            options: {}
          },
          {
            id: 'input_2',
            type: 'FormItem',
            component: 'Input',
            display: true,
            options: {}
            // 没有 model
          }
        ]
      }
      
      const formData = buildFormData(schema)
      
      expect(formData).toEqual({
        username: ''
      })
      expect(formData).not.toHaveProperty('input_2')
    })
  })

  describe('validateSchema', () => {
    it('应该验证有效的schema', () => {
      const schema: SchemaTree = {
        id: 'root',
        type: 'Container',
        component: 'Container',
        display: true,
        options: {},
        children: []
      }
      
      const isValid = validateSchema(schema)
      
      expect(isValid).toBe(true)
    })

    it('应该拒绝无效的schema - 缺少type', () => {
      const schema = {
        id: 'root',
        component: 'Container',
        display: true,
        options: {},
        children: []
      } as any
      
      const isValid = validateSchema(schema)
      
      expect(isValid).toBe(false)
    })

    it('应该拒绝无效的schema - type不是Container', () => {
      const schema = {
        id: 'root',
        type: 'FormItem',
        component: 'Container',
        display: true,
        options: {},
        children: []
      } as any
      
      const isValid = validateSchema(schema)
      
      expect(isValid).toBe(false)
    })

    it('应该拒绝无效的schema - children不是数组', () => {
      const schema = {
        id: 'root',
        type: 'Container',
        component: 'Container',
        display: true,
        options: {},
        children: 'invalid'
      } as any
      
      const isValid = validateSchema(schema)
      
      expect(isValid).toBe(false)
    })

    it('应该拒绝null或undefined', () => {
      expect(validateSchema(null)).toBe(false)
      expect(validateSchema(undefined)).toBe(false)
    })
  })

  describe('cloneSchema', () => {
    it('应该深度克隆schema', () => {
      const original: SchemaTree = {
        id: 'root',
        type: 'Container',
        component: 'Container',
        display: true,
        options: {},
        children: [
          {
            id: 'input_1',
            type: 'FormItem',
            component: 'Input',
            model: 'username',
            display: true,
            options: {}
          }
        ]
      }
      
      const cloned = cloneSchema(original)
      
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.children).not.toBe(original.children)
      expect(cloned.children[0]).not.toBe(original.children[0])
    })

    it('修改克隆不应该影响原始schema', () => {
      const original: SchemaTree = {
        id: 'root',
        type: 'Container',
        component: 'Container',
        display: true,
        options: {},
        children: [
          {
            id: 'input_1',
            type: 'FormItem',
            component: 'Input',
            model: 'username',
            display: true,
            options: {}
          }
        ]
      }
      
      const cloned = cloneSchema(original)
      cloned.children[0].model = 'modified'
      
      expect(original.children[0].model).toBe('username')
      expect(cloned.children[0].model).toBe('modified')
    })
  })
})
