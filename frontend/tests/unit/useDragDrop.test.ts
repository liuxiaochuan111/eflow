/**
 * useDragDrop Composable 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { useDragDrop } from '@/composables/useDragDrop'
import { CONTAINER_CONFIG, FORM_ITEM_CONFIG } from '@/configs'
import type { SchemaTree } from '@/types'

describe('useDragDrop', () => {
  let mockSchema: any
  let mockUpdateSchema: any

  beforeEach(() => {
    // 创建 mock schema
    mockSchema = ref({
      id: 'root',
      type: 'Container',
      component: 'Container',
      display: true,
      options: {},
      children: []
    })

    mockUpdateSchema = vi.fn()
  })

  describe('onDragStartConfig', () => {
    it('应该能开始拖拽容器配置', () => {
      const { onDragStartConfig, draggingNode } = useDragDrop(mockSchema, mockUpdateSchema)
      
      const containerConfig = CONTAINER_CONFIG[0]
      onDragStartConfig(containerConfig, 'container')
      
      expect(draggingNode.value).not.toBeNull()
      expect(draggingNode.value?.type).toBe('Container')
      expect(draggingNode.value?.component).toBe(containerConfig.name)
    })

    it('应该能开始拖拽表单项配置', () => {
      const { onDragStartConfig, draggingNode } = useDragDrop(mockSchema, mockUpdateSchema)
      
      const formItemConfig = FORM_ITEM_CONFIG[0]
      onDragStartConfig(formItemConfig, 'formItem')
      
      expect(draggingNode.value).not.toBeNull()
      expect(draggingNode.value?.type).toBe('FormItem')
      expect(draggingNode.value?.component).toBe(formItemConfig.name)
    })
  })

  describe('onDragEnd', () => {
    it('应该能清除拖拽状态', () => {
      const { onDragStartConfig, onDragEnd, draggingNode, draggingType } = useDragDrop(mockSchema, mockUpdateSchema)
      
      onDragStartConfig(CONTAINER_CONFIG[0], 'container')
      expect(draggingNode.value).not.toBeNull()
      
      onDragEnd()
      
      expect(draggingNode.value).toBeNull()
      expect(draggingType.value).toBeNull()
    })
  })

  describe('canDrop', () => {
    it('容器应该可以放到根节点', () => {
      const { onDragStartConfig, canDrop, draggingNode } = useDragDrop(mockSchema, mockUpdateSchema)
      
      onDragStartConfig(CONTAINER_CONFIG[0], 'container')
      const result = canDrop(draggingNode.value!, null)
      
      expect(result).toBe(true)
    })

    it('表单项应该可以放到根节点', () => {
      const { onDragStartConfig, canDrop, draggingNode } = useDragDrop(mockSchema, mockUpdateSchema)
      
      onDragStartConfig(FORM_ITEM_CONFIG[0], 'formItem')
      const result = canDrop(draggingNode.value!, null)
      
      expect(result).toBe(true)
    })

    it('没有拖拽节点时不能放置', () => {
      const { canDrop } = useDragDrop(mockSchema, mockUpdateSchema)
      
      const result = canDrop(null as any, null)
      
      expect(result).toBe(false)
    })
  })

  describe('onDragOverNode', () => {
    it('应该能设置悬停节点', () => {
      const { onDragStartConfig, onDragOverNode, hoveredNodeId } = useDragDrop(mockSchema, mockUpdateSchema)
      
      onDragStartConfig(CONTAINER_CONFIG[0], 'container')
      onDragOverNode('test_node_id', 0)
      
      expect(hoveredNodeId.value).toBe('test_node_id')
    })
  })

  describe('onDropNode', () => {
    it('应该能放置节点到根节点', () => {
      const { onDragStartConfig, onDropNode, onDragEnd } = useDragDrop(mockSchema, mockUpdateSchema)
      
      onDragStartConfig(FORM_ITEM_CONFIG[0], 'formItem')
      const result = onDropNode(null, -1)
      
      expect(result).toBe(true)
      expect(mockSchema.value.children).toHaveLength(1)
      expect(mockSchema.value.children[0].type).toBe('FormItem')
      expect(mockUpdateSchema).toHaveBeenCalled()
      
      onDragEnd()
    })

    it('不能放置时不应该添加节点', () => {
      const { onDropNode } = useDragDrop(mockSchema, mockUpdateSchema)
      
      const result = onDropNode(null, -1)
      
      expect(result).toBe(false)
      expect(mockSchema.value.children).toHaveLength(0)
    })
  })
})
