/**
 * Schema 操作 Composable
 */

import { ref, computed } from 'vue'
import type { SchemaNode, SchemaTree, FormItemNode, ContainerNode } from '@/types'

export function useSchema(initialSchema?: SchemaTree) {
  const schema = ref<SchemaTree>(
    initialSchema || {
      type: 'Container',
      component: 'Container',
      display: true,
      options: {},
      children: []
    }
  )

  // 生成唯一ID
  const generateId = (prefix: string): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 查找节点
  const findNode = (nodeId: string, node?: SchemaNode): SchemaNode | null => {
    const current = node || schema.value

    if (current.id === nodeId) {
      return current
    }

    if (current.children) {
      for (const child of current.children) {
        const found = findNode(nodeId, child)
        if (found) return found
      }
    }

    return null
  }

  // 查找父节点
  const findParentNode = (nodeId: string, node?: SchemaNode): SchemaNode | null => {
    const current = node || schema.value

    if (current.children) {
      for (const child of current.children) {
        if (child.id === nodeId) {
          return current
        }
        const found = findParentNode(nodeId, child)
        if (found) return found
      }
    }

    return null
  }

  // 添加节点
  const addNode = (
    parentNodeId: string | null,
    node: Omit<SchemaNode, 'id'>,
    index?: number
  ): SchemaNode => {
    const newNode: SchemaNode = {
      ...node,
      id: generateId(node.component.toLowerCase())
    }

    if (parentNodeId === null) {
      // 添加到根节点
      schema.value.children.push(newNode)
    } else {
      const parent = findNode(parentNodeId)
      if (parent && parent.children) {
        if (index !== undefined) {
          parent.children.splice(index, 0, newNode)
        } else {
          parent.children.push(newNode)
        }
      }
    }

    return newNode
  }

  // 删除节点
  const deleteNode = (nodeId: string): boolean => {
    const parent = findParentNode(nodeId)
    if (parent && parent.children) {
      const index = parent.children.findIndex((child) => child.id === nodeId)
      if (index > -1) {
        parent.children.splice(index, 1)
        return true
      }
    }
    return false
  }

  // 更新节点
  const updateNode = (nodeId: string, updates: Partial<SchemaNode>): boolean => {
    const node = findNode(nodeId)
    if (node) {
      Object.assign(node, updates)
      return true
    }
    return false
  }

  // 批量设置节点属性
  const setSchemaByConfig = (
    config: Record<string, any>,
    prop: string = 'value'
  ): void => {
    Object.entries(config).forEach(([model, value]) => {
      const node = findNode(model)
      if (node) {
        if (prop === 'value' && node.type === 'FormItem') {
          // 值的设置由外部 formData 处理
        } else {
          node.options[prop] = value
        }
      }
    })
  }

  // 获取所有表单项节点
  const getFormItemNodes = (node?: SchemaNode): FormItemNode[] => {
    const current = node || schema.value
    const items: FormItemNode[] = []

    if (current.type === 'FormItem') {
      items.push(current as FormItemNode)
    }

    if (current.children) {
      for (const child of current.children) {
        items.push(...getFormItemNodes(child))
      }
    }

    return items
  }

  // 获取所有节点（扁平化）
  const flattenNodes = (node?: SchemaNode): SchemaNode[] => {
    const current = node || schema.value
    const nodes: SchemaNode[] = [current]

    if (current.children) {
      for (const child of current.children) {
        nodes.push(...flattenNodes(child))
      }
    }

    return nodes
  }

  // 克隆节点
  const cloneNode = (node: SchemaNode): SchemaNode => {
    return JSON.parse(JSON.stringify(node))
  }

  // 移动节点
  const moveNode = (nodeId: string, targetParentId: string | null, index?: number): boolean => {
    const node = findNode(nodeId)
    if (!node) return false

    // 先从原位置移除
    const oldParent = findParentNode(nodeId)
    if (oldParent && oldParent.children) {
      const oldIndex = oldParent.children.findIndex((child) => child.id === nodeId)
      if (oldIndex > -1) {
        oldParent.children.splice(oldIndex, 1)
      }
    }

    // 添加到新位置
    if (targetParentId === null) {
      schema.value.children.push(node)
    } else {
      const newParent = findNode(targetParentId)
      if (newParent && newParent.children) {
        if (index !== undefined) {
          newParent.children.splice(index, 0, node)
        } else {
          newParent.children.push(node)
        }
      } else {
        // 如果新父节点无效，放回原位置
        if (oldParent && oldParent.children) {
          oldParent.children.push(node)
        }
        return false
      }
    }

    return true
  }

  return {
    schema,
    findNode,
    findParentNode,
    addNode,
    deleteNode,
    updateNode,
    setSchemaByConfig,
    getFormItemNodes,
    flattenNodes,
    cloneNode,
    moveNode,
    generateId
  }
}
