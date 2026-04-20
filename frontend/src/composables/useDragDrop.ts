/**
 * 拖拽逻辑 Composable
 */

import { ref } from 'vue'
import type { SchemaNode, ContainerConfig, FormItemConfig } from '@/types'
import { getContainerConfig } from '@/configs'
import { generateId } from '@/utils'

export function useDragDrop(schema: any, updateSchema: (newSchema: any) => void) {
  const draggingNode = ref<SchemaNode | null>(null)
  const draggingType = ref<'container' | 'formItem' | null>(null)
  const dragTarget = ref<{ nodeId: string | null; index: number } | null>(null)
  const hoveredNodeId = ref<string | null>(null)

  // 开始拖拽配置项
  const onDragStartConfig = (config: ContainerConfig | FormItemConfig, type: 'container' | 'formItem') => {
    draggingNode.value = {
      id: `new_${config.name}_${Date.now()}`,
      type: config.type,
      component: config.name,
      display: true,
      options: { ...(config.defaultOptions || {}) },
      children: config.type === 'Container' ? [] : undefined
    } as SchemaNode
    draggingType.value = type
  }

  // 拖拽结束
  const onDragEnd = () => {
    draggingNode.value = null
    draggingType.value = null
    dragTarget.value = null
    hoveredNodeId.value = null
  }

  // 检查是否可以放置
  const canDrop = (dragNode: SchemaNode, targetNodeId: string | null): boolean => {
    if (!dragNode) return false

    if (dragNode.type === 'Container') {
      const config = getContainerConfig(dragNode.component)
      if (!config) return false

      if (targetNodeId === null) {
        return config.father.includes('')
      }

      return true // 简化处理，容器可以放到任何容器中
    } else if (dragNode.type === 'FormItem') {
      // 表单项可以放到任何容器中
      return true
    }

    return false
  }

  // 拖拽经过节点
  const onDragOverNode = (nodeId: string | null, index: number = -1) => {
    if (!draggingNode.value) return

    if (canDrop(draggingNode.value, nodeId)) {
      hoveredNodeId.value = nodeId
      dragTarget.value = { nodeId, index }
    }
  }

  // 离开节点
  const onDragLeaveNode = () => {
    hoveredNodeId.value = null
  }

  // 放置节点
  const onDropNode = (targetNodeId: string | null, index: number = -1): boolean => {
    if (!draggingNode.value) return false

    if (!canDrop(draggingNode.value, targetNodeId)) {
      return false
    }

    const newNode = { ...draggingNode.value }
    newNode.id = generateId(newNode.component.toLowerCase())

    if (targetNodeId === null) {
      // 添加到根节点
      if (!schema.value.children) {
        schema.value.children = []
      }
      schema.value.children.push(newNode)
    } else {
      // 添加到指定容器
      const targetNode = findNodeById(schema.value, targetNodeId)
      if (targetNode) {
        if (!targetNode.children) {
          targetNode.children = []
        }
        if (index >= 0 && index < targetNode.children.length) {
          targetNode.children.splice(index, 0, newNode)
        } else {
          targetNode.children.push(newNode)
        }
      }
    }

    // 触发更新
    updateSchema({ ...schema.value })
    onDragEnd()
    return true
  }

  // 递归查找节点
  const findNodeById = (node: any, id: string): any => {
    if (node.id === id) return node
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id)
        if (found) return found
      }
    }
    return null
  }

  // 删除节点
  const deleteNode = (nodeId: string): boolean => {
    const removeNode = (node: any): boolean => {
      if (node.children) {
        const index = node.children.findIndex((child: any) => child.id === nodeId)
        if (index > -1) {
          node.children.splice(index, 1)
          return true
        }
        for (const child of node.children) {
          if (removeNode(child)) return true
        }
      }
      return false
    }

    const result = removeNode(schema.value)
    if (result) {
      updateSchema({ ...schema.value })
    }
    return result
  }

  // 更新节点
  const updateNode = (nodeId: string, updates: Partial<SchemaNode>): boolean => {
    const node = findNodeById(schema.value, nodeId)
    if (node) {
      Object.assign(node, updates)
      updateSchema({ ...schema.value })
      return true
    }
    return false
  }

  return {
    draggingNode,
    draggingType,
    dragTarget,
    hoveredNodeId,
    onDragStartConfig,
    onDragEnd,
    onDragOverNode,
    onDragLeaveNode,
    onDropNode,
    deleteNode,
    updateNode,
    canDrop,
    findNodeById
  }
}
