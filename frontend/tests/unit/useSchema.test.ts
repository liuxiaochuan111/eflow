/**
 * useSchema Composable 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useSchema } from '@/composables/useSchema'
import type { SchemaTree } from '@/types'

describe('useSchema', () => {
  let schema: SchemaTree

  beforeEach(() => {
    // 每个测试前创建一个新的 schema
    const { schema: initialSchema } = useSchema()
    schema = initialSchema.value as SchemaTree
  })

  describe('generateId', () => {
    it('应该生成唯一ID', () => {
      const { schema: schemaRef, generateId } = useSchema()
      const id1 = generateId('test')
      const id2 = generateId('test')
      
      expect(id1).not.toBe(id2)
      expect(id1).toContain('test_')
    })

    it('生成的ID应该包含前缀', () => {
      const { generateId } = useSchema()
      const id = generateId('input')
      
      expect(id).toMatch(/^input_\d+_[a-z0-9]+$/)
    })
  })

  describe('findNode', () => {
    it('应该能找到根节点', () => {
      const { findNode, schema: schemaRef } = useSchema()
      const found = findNode(schemaRef.value.id)
      
      expect(found).not.toBeNull()
      expect(found?.id).toBe(schemaRef.value.id)
    })

    it('应该能找到子节点', () => {
      const { schema: schemaRef, findNode, addNode } = useSchema()
      
      const newNode = addNode(null, {
        type: 'FormItem',
        component: 'Input',
        display: true,
        options: {}
      })
      
      const found = findNode(newNode.id)
      expect(found).not.toBeNull()
      expect(found?.id).toBe(newNode.id)
      expect(found?.component).toBe('Input')
    })

    it('找不到不存在的节点应该返回null', () => {
      const { findNode } = useSchema()
      const found = findNode('non_existent_id')
      
      expect(found).toBeNull()
    })
  })

  describe('findParentNode', () => {
    it('应该能找到子节点的父节点', () => {
      const { schema: schemaRef, findParentNode, addNode } = useSchema()
      
      const newNode = addNode(null, {
        type: 'FormItem',
        component: 'Input',
        display: true,
        options: {}
      })
      
      const parent = findParentNode(newNode.id)
      expect(parent).not.toBeNull()
      expect(parent?.id).toBe(schemaRef.value.id)
    })

    it('找不到根节点的父节点应该返回null', () => {
      const { schema: schemaRef, findParentNode } = useSchema()
      const parent = findParentNode(schemaRef.value.id)
      
      expect(parent).toBeNull()
    })
  })

  describe('addNode', () => {
    it('应该能添加节点到根节点', () => {
      const { schema: schemaRef, addNode } = useSchema()
      
      const newNode = addNode(null, {
        type: 'FormItem',
        component: 'Input',
        display: true,
        options: {}
      })
      
      expect(schemaRef.value.children).toHaveLength(1)
      expect(schemaRef.value.children[0].id).toBe(newNode.id)
      expect(newNode.component).toBe('Input')
    })

    it('应该能添加节点到指定父节点', () => {
      const { addNode, findNode } = useSchema()
      
      // 先添加一个容器
      const container = addNode(null, {
        type: 'Container',
        component: 'Form',
        display: true,
        options: {},
        children: []
      })
      
      // 在容器中添加表单项
      const formItem = addNode(container.id, {
        type: 'FormItem',
        component: 'Input',
        display: true,
        options: {}
      })
      
      const foundContainer = findNode(container.id)
      expect(foundContainer?.children).toHaveLength(1)
      expect(foundContainer?.children?.[0].id).toBe(formItem.id)
    })

    it('应该在指定索引位置插入节点（在父节点中）', () => {
      const { addNode, findNode, schema: schemaRef } = useSchema()

      // 先添加一个容器作为父节点
      const container = addNode(null, {
        type: 'Container',
        component: 'Form',
        display: true,
        options: {},
        children: []
      })

      // 在容器中添加两个节点
      addNode(container.id, { type: 'FormItem', component: 'Input', display: true, options: {} })
      addNode(container.id, { type: 'FormItem', component: 'Select', display: true, options: {} })

      // 在索引1的位置插入新节点（应该在Input和Select之间）
      const newNode = addNode(container.id, {
        type: 'FormItem',
        component: 'DatePicker',
        display: true,
        options: {}
      }, 1)

      const updatedContainer = findNode(container.id)
      expect(updatedContainer?.children).toHaveLength(3)
      expect(updatedContainer?.children[1].id).toBe(newNode.id)
      expect(updatedContainer?.children[1].component).toBe('DatePicker')
      expect(updatedContainer?.children[0].component).toBe('Input')
      expect(updatedContainer?.children[2].component).toBe('Select')
    })
  })

  describe('deleteNode', () => {
    it('应该能删除节点', () => {
      const { schema: schemaRef, addNode, deleteNode } = useSchema()
      
      const newNode = addNode(null, {
        type: 'FormItem',
        component: 'Input',
        display: true,
        options: {}
      })
      
      expect(schemaRef.value.children).toHaveLength(1)
      
      const deleted = deleteNode(newNode.id)
      
      expect(deleted).toBe(true)
      expect(schemaRef.value.children).toHaveLength(0)
    })

    it('删除不存在的节点应该返回false', () => {
      const { deleteNode } = useSchema()
      const deleted = deleteNode('non_existent_id')
      
      expect(deleted).toBe(false)
    })

    it('不能删除根节点', () => {
      const { schema: schemaRef, deleteNode } = useSchema()
      const deleted = deleteNode(schemaRef.value.id)
      
      expect(deleted).toBe(false)
    })
  })

  describe('updateNode', () => {
    it('应该能更新节点属性', () => {
      const { addNode, updateNode, findNode } = useSchema()
      
      const newNode = addNode(null, {
        type: 'FormItem',
        component: 'Input',
        display: true,
        options: {}
      })
      
      updateNode(newNode.id, { display: false })
      
      const updatedNode = findNode(newNode.id)
      expect(updatedNode?.display).toBe(false)
    })

    it('更新不存在的节点应该返回false', () => {
      const { updateNode } = useSchema()
      const updated = updateNode('non_existent_id', { display: false })
      
      expect(updated).toBe(false)
    })
  })
})
