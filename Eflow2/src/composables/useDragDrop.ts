import { ref, type Ref } from 'vue'
import type { SchemaNode, DragItem } from '../types'
import { getComponentSetters } from '../setters'

export function useDragDrop(schema: Ref<SchemaNode[]>) {
  const draggingItem = ref<DragItem | null>(null)
  const draggingNode = ref<{ node: SchemaNode; parent: SchemaNode | null; index: number } | null>(null)
  const dropTarget = ref<{ node: SchemaNode; parent: SchemaNode | null } | null>(null)

  // Check if item can be dropped on target node
  const canDropOn = (item: DragItem, targetNode: SchemaNode): boolean => {
    const itemDef = getComponentSetters(item.type)
    const targetDef = getComponentSetters(targetNode.type)

    if (!itemDef || !targetDef) return false

    // If item is a container, it can be placed in any container or at root
    if (item.isContainer) {
      return targetDef.type === 'Container' || targetDef.type === 'Block' || targetDef.type === 'Tab' || targetDef.type === 'TabItem'
    }

    // Form components need to check father rules
    if (itemDef.father && itemDef.father.length > 0) {
      return itemDef.father.includes(targetDef.type)
    }

    return false
  }

  // Add node to schema
  const addNode = (item: DragItem, targetNode?: SchemaNode, targetIndex?: number) => {
    const newNode: SchemaNode = {
      type: item.type,
      label: `${item.type}_${Date.now()}`,
      model: `${item.type}_${Date.now()}`,
      display: true,
      children: item.isContainer ? [] : undefined
    }

    if (targetNode && targetNode.children) {
      // Add to target node's children
      if (targetIndex !== undefined) {
        targetNode.children.splice(targetIndex, 0, newNode)
      } else {
        targetNode.children.push(newNode)
      }
    } else {
      // Add to root
      if (targetIndex !== undefined) {
        schema.value.splice(targetIndex, 0, newNode)
      } else {
        schema.value.push(newNode)
      }
    }

    return newNode
  }

  // Remove node from schema
  const removeNode = (node: SchemaNode) => {
    const removeFromArray = (nodes: SchemaNode[]): boolean => {
      const index = nodes.findIndex(n => n === node)
      if (index !== -1) {
        nodes.splice(index, 1)
        return true
      }
      for (const child of nodes) {
        if (child.children && removeFromArray(child.children)) {
          return true
        }
      }
      return false
    }

    removeFromArray(schema.value)
  }

  return {
    draggingItem,
    draggingNode,
    dropTarget,
    canDropOn,
    addNode,
    removeNode
  }
}
