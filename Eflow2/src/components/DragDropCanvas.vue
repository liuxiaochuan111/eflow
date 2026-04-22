<template>
  <div
    class="drag-drop-canvas"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    :class="{ 'drag-over': isDragOver, 'can-drop': canDrop }"
  >
    <div v-if="schema.length === 0" class="canvas-empty">
      <el-empty description="拖拽左侧组件到此处开始编排" />
    </div>

    <div v-else class="canvas-content">
      <CanvasNode
        v-for="(node, index) in schema"
        :key="node.label"
        :node="node"
        :index="index"
        :selected-node="selectedNode"
        :dragging-item="draggingItem"
        @select="$emit('select', $event)"
        @delete="$emit('delete', $event)"
        @dragstart="$emit('nodestart', $event)"
        @dragend="$emit('nodeend', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CanvasNode from './CanvasNode.vue'
import type { SchemaNode, DragItem } from '../types'

interface Props {
  schema: SchemaNode[]
  selectedNode: SchemaNode | null
  draggingItem: DragItem | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  drop: [event: DragEvent, targetIndex?: number]
  select: [node: SchemaNode]
  delete: [node: SchemaNode]
  nodestart: [data: any]
  nodeend: [data: any]
}>()

const isDragOver = ref(false)
const dropTarget = ref<number | null>(null)

const canDrop = computed(() => {
  if (!props.draggingItem) return false

  // Check if we can drop based on father rules
  const item = props.draggingItem

  // Containers can be dropped at root level
  if (item.isContainer) {
    return true
  }

  // Form components need Row or wrap parent
  // For now, allow dropping at root level
  return true
})

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'copy'
  isDragOver.value = true
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  // Only set false if we're actually leaving the canvas
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragOver.value = false
    dropTarget.value = null
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false

  const data = event.dataTransfer!.getData('component')
  if (!data) return

  emit('drop', event, dropTarget.value || undefined)
  dropTarget.value = null
}
</script>

<style scoped>
.drag-drop-canvas {
  min-height: 100%;
  border-radius: 4px;
  transition: all 0.3s;
}

.drag-drop-canvas.drag-over {
  background: #ecf5ff;
  border: 2px dashed #409eff;
}

.drag-drop-canvas.can-drop {
  background: #f0f9ff;
}

.canvas-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.canvas-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
