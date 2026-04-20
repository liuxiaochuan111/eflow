/**
 * 容器拖拽处理 Composable
 * 统一处理所有容器的拖拽事件
 */

import { inject, computed } from 'vue'
import type { SchemaNode } from '@/types'

export function useContainerDrag(props: any, emit: any) {
  // 从父组件注入拖拽状态
  const dragState = inject<any>('dragState', {
    draggingNode: null,
    hoveredNodeId: null,
    dragTarget: null,
    selectedNode: null
  })

  // 计算属性
  const isHovered = computed(() => dragState.hoveredNodeId === props.schema?.id)
  const isDragOver = computed(() => dragState.hoveredNodeId === props.schema?.id)
  const canDropHere = computed(() => {
    if (!dragState.draggingNode) return false

    // 容器可以接收任何组件
    return true
  })

  const dragTarget = computed(() => {
    if (dragState.dragTarget?.nodeId === props.schema?.id) {
      return dragState.dragTarget
    }
    return null
  })

  // 事件处理方法
  const handleUpdate = (value: any) => {
    emit('update:modelValue', value)
  }

  const handleNodeClick = (node: SchemaNode) => {
    emit('node-click', node)
  }

  const handleNodeDelete = (nodeId: string) => {
    emit('node-delete', nodeId)
  }

  const handleChildDragOver = (nodeId: string, index: number) => {
    emit('drag-over', nodeId, index)
  }

  const handleChildDragLeave = () => {
    emit('drag-leave')
  }

  const handleChildDrop = (nodeId: string, index: number) => {
    emit('drop', nodeId, index)
  }

  const handleDragOver = (e: DragEvent) => {
    e.stopPropagation()
    if (props.schema) {
      emit('drag-over', props.schema.id, -1)
    }
  }

  const handleDragLeave = (e: DragEvent) => {
    if (e.target === e.currentTarget) {
      emit('drag-leave')
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.stopPropagation()
    if (props.schema) {
      emit('drop', props.schema.id, -1)
    }
  }

  return {
    dragState,
    isHovered,
    isDragOver,
    canDropHere,
    dragTarget,
    handleUpdate,
    handleNodeClick,
    handleNodeDelete,
    handleChildDragOver,
    handleChildDragLeave,
    handleChildDrop,
    handleDragOver,
    handleDragLeave,
    handleDrop
  }
}
