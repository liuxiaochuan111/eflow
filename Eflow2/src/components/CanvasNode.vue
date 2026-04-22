<template>
  <div
    class="canvas-node"
    :class="{
      selected: node === selectedNode,
      'is-container': isContainer(node),
      'can-drop': canDropHere
    }"
    :draggable="!isContainer(node)"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click.stop="handleSelect"
  >
    <div class="node-header">
      <el-icon>
        <component :is="getNodeIcon(node.type)" />
      </el-icon>
      <span class="node-label">{{ getNodeLabel(node) }}</span>
      <div class="node-actions">
        <aui-button
          size="small"
          type="danger"
          :icon="Delete"
          circle
          @click.stop="handleDelete"
        />
      </div>
    </div>

    <!-- Children area (only for containers) -->
    <div v-if="isContainer(node)" class="node-children-container">
      <div
        v-if="node.children && node.children.length > 0"
        class="node-children"
      >
        <CanvasNode
          v-for="(child, index) in node.children"
          :key="child.label"
          :node="child"
          :index="index"
          :selected-node="selectedNode"
          :parent="node"
          :dragging-item="draggingItem"
          @select="$emit('select', $event)"
          @delete="$emit('delete', $event)"
          @dragstart="$emit('dragstart', $event)"
          @dragend="$emit('dragend', $event)"
          @drop="handleChildDrop($event, child, index)"
        />
      </div>

      <!-- Drop zone for empty containers -->
      <div
        v-else
        class="drop-zone"
        :class="{ 'drag-over': isDragOver }"
        @drop="handleDrop($event, node, null)"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <span class="drop-hint">
          {{ getDropHint(node.type) }}
        </span>
      </div>

      <!-- Drop zone between children -->
      <div
        v-if="node.children && node.children.length > 0"
        class="drop-zone-after"
        @drop="handleDrop($event, node, node.children.length)"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <span class="drop-hint-small">+</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Delete, FolderOpened, Grid, Document, Tickets, Edit } from '@element-plus/icons-vue'
import type { SchemaNode, DragItem } from '../types'

interface Props {
  node: SchemaNode
  index: number
  selectedNode: SchemaNode | null
  parent?: SchemaNode
  draggingItem?: DragItem | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [node: SchemaNode]
  delete: [node: SchemaNode]
  dragstart: [data: any]
  dragend: [data: any]
  drop: [event: DragEvent, targetNode: SchemaNode, targetIndex: number | null]
}>()

const isDragOver = ref(false)

const isContainer = (node: SchemaNode): boolean => {
  return ['Block', 'Container', 'Tab', 'TabItem', 'Row', 'FormItem'].includes(node.type)
}

const canAcceptDrop = (node: SchemaNode): boolean => {
  // 只有Block、Container、Row、Tab、TabItem可以接受新的拖拽组件
  // FormItem不能接受新的组件，因为它在创建时就包含了子组件
  return ['Block', 'Container', 'Row', 'Tab', 'TabItem'].includes(node.type)
}

const canDropHere = computed(() => {
  if (!props.draggingItem) return false

  // 总是允许尝试拖拽，实际验证在drop时进行
  return true
})

const getNodeIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    Block: FolderOpened,
    Container: Grid,
    Tab: Tickets,
    TabItem: Document,
    Row: Edit,
    Input: Edit,
    Select: Edit
  }
  return iconMap[type] || Edit
}

const getNodeLabel = (node: SchemaNode) => {
  return node.title || node.label || node.type
}

const getDropHint = (nodeType: string) => {
  const hints: Record<string, string> = {
    Block: '拖拽组件到Block容器',
    Container: '拖拽组件到容器',
    TabItem: '拖拽组件到标签项',
    Row: '拖拽表单组件到行',
    Tab: '拖拽TabItem到标签页'
  }
  return hints[nodeType] || '拖拽组件到此处'
}

const handleSelect = () => {
  emit('select', props.node)
}

const handleDelete = () => {
  emit('delete', props.node)
}

const handleDragStart = (_event: DragEvent) => {
  emit('dragstart', {
    node: props.node,
    parent: props.parent,
    index: props.index
  })
}

const handleDragEnd = () => {
  emit('dragend', undefined)
}

const handleDrop = (event: DragEvent, targetNode: SchemaNode, targetIndex: number | null) => {
  event.preventDefault()
  event.stopPropagation()
  isDragOver.value = false

  console.log('CanvasNode handleDrop:', props.node.type, 'targetIndex:', targetIndex)

  // Check if this node can accept drops
  if (!canAcceptDrop(props.node)) {
    console.log('CanvasNode handleDrop: Node cannot accept drop, passing to parent')
    // Pass to parent node if exists
    if (props.parent) {
      console.log('CanvasNode handleDrop: Passing to parent:', props.parent.type)
      emit('drop', event, props.parent, null)
    }
    return
  }

  emit('drop', event, targetNode, targetIndex ?? null)
}

const handleChildDrop = (event: DragEvent, _child: SchemaNode, index: number) => {
  // Check if this is a new component drag from left panel (not a node reorder)
  const dragData = event.dataTransfer?.getData('component')

  if (dragData) {
    // This is a new component from left panel
    event.stopPropagation()
    isDragOver.value = false

    // Check if current node can accept the drop
    if (canAcceptDrop(props.node)) {
      console.log('CanvasNode handleChildDrop: Parent can accept drop:', props.node.type, 'index:', index)
      emit('drop', event, props.node, index)
    } else {
      // Pass to grandparent
      console.log('CanvasNode handleChildDrop: Parent cannot accept, passing to grandparent:', props.node.type)
      if (props.parent) {
        emit('drop', event, props.parent, null)
      }
    }
  } else {
    // This is a node reorder - child will handle it
    console.log('CanvasNode handleChildDrop: Node reorder, ignoring')
    event.stopPropagation()
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()

  // 设置拖拽效果
  event.dataTransfer!.dropEffect = 'copy'

  // 总是显示高亮，实际验证在drop时进行
  isDragOver.value = true

  console.log('CanvasNode handleDragOver:', props.node.type, 'dragging:', props.draggingItem?.type)
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()

  // 总是显示高亮
  isDragOver.value = true

  console.log('CanvasNode handleDragEnter:', props.node.type, 'dragging:', props.draggingItem?.type)
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY

  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    isDragOver.value = false
    console.log('CanvasNode handleDragLeave:', props.node.type)
  }
}
</script>

<style scoped>
.canvas-node {
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  background: white;
  transition: all 0.3s;
  cursor: pointer;
  margin-bottom: 10px;
  position: relative;
}

.canvas-node:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.canvas-node.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.canvas-node.drag-over {
  border-color: #67c23a !important;
  background: #e1f3d8 !important;
  box-shadow: 0 0 0 4px rgba(103, 194, 58, 0.3);
  transform: scale(1.01);
}

.canvas-node.can-drop {
  border-style: dashed;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.node-header .el-icon {
  color: #409eff;
  font-size: 18px;
}

.node-label {
  flex: 1;
  font-weight: 500;
  color: #303133;
}

.node-children-container {
  margin-top: 10px;
  padding-left: 20px;
  border-left: 2px dashed #e0e0e0;
  min-height: 50px;
  transition: all 0.3s;
}

.node-children-container.drag-over {
  border-left: 2px dashed #67c23a;
  background: #f0f9ff;
}

.node-children {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drop-zone {
  min-height: 50px;
  border: 2px dashed #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.drop-zone.drag-over {
  border-color: #67c23a;
  background: #f0f9ff;
  border-style: solid;
  animation: pulse 1s infinite;
}

.drop-zone-after {
  min-height: 40px;
  border: 2px dashed #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  margin-top: 5px;
  cursor: copy;
}

.drop-zone-after.drag-over {
  border-color: #67c23a;
  background: #f0f9ff;
  border-style: solid;
  animation: pulse 1s infinite;
  min-height: 60px;
}

.drop-hint {
  color: #909399;
  font-size: 12px;
  pointer-events: none;
}

.drop-hint-small {
  color: #c0c4cc;
  font-size: 20px;
  font-weight: bold;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
