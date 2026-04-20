<template>
  <el-form
    :label-position="options.labelPosition || 'top'"
    :label-width="options.labelWidth || '100px'"
    :size="options.size || 'default'"
    :disabled="options.disabled || false"
    :model="formData"
    class="form-container"
    :class="[
      { 'is-build': isBuild },
      { 'is-hovered': isHovered && canDropHere },
      { 'is-drag-over': isDragOver }
    ]"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- 容器标签 -->
    <div v-if="isBuild" class="container-header">
      <div class="container-badge">
        <el-icon><Document /></el-icon>
        <span>Form</span>
      </div>
      <div class="container-meta">
        <el-tag size="small" type="info">{{ options.labelPosition }}</el-tag>
      </div>
      <div class="container-actions">
        <el-button
          type="primary"
          size="small"
          :icon="Setting"
          circle
          @click.stop="handleNodeClick(schema)"
          title="配置"
        />
        <el-button
          type="danger"
          size="small"
          :icon="Delete"
          circle
          @click.stop="handleNodeDelete(schema.id)"
          title="删除"
        />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="isBuild && !schema.children?.length" class="empty-state">
      <el-icon class="empty-icon"><Plus /></el-icon>
      <span class="empty-text">拖拽表单项到此处</span>
    </div>

    <!-- 子节点容器 -->
    <div class="form-children-wrapper">
      <template v-if="schema.children?.length">
        <div class="form-children">
          <template v-for="(child, index) in schema.children" :key="child.id">
            <!-- 拖拽插入线 -->
            <div
              v-if="isBuild && isDragOver && dragTarget?.index === index"
              class="drop-indicator"
            ></div>

            <component
              :is="getChildComponent(child)"
              :schema="child"
              :is-build="isBuild"
              :form-data="formData"
              :event-config="eventConfig"
              :custom-funcs="customFuncs"
              v-bind="child.options"
              @update:model-value="handleUpdate"
              @node-click="handleNodeClick"
              @node-delete="handleNodeDelete"
              @item-reorder="handleItemReorder"
              @drag-over="handleChildDragOver"
              @drag-leave="handleChildDragLeave"
              @drop="handleChildDrop"
            >
              <template v-for="(_, slotName) in $slots" #[slotName]="scope">
                <slot :name="slotName" v-bind="scope" />
              </template>
            </component>
          </template>

          <!-- 末尾拖拽插入线 -->
          <div
            v-if="isBuild && isDragOver && dragTarget?.index === -1"
            class="drop-indicator"
          ></div>
        </div>
      </template>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { Document, Plus, Setting, Delete } from '@element-plus/icons-vue'
import { ElForm, ElTag, ElIcon } from 'element-plus'
import type { SchemaNode } from '@/types'

interface Props {
  schema: SchemaNode
  isBuild?: boolean
  formData?: Record<string, any>
  eventConfig?: any
  customFuncs?: Record<string, Function>
}

const props = withDefaults(defineProps<Props>(), {
  isBuild: false,
  formData: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'node-click': [node: SchemaNode]
  'node-delete': [nodeId: string]
  'drag-over': [nodeId: string, index: number]
  'drag-leave': []
  'drop': [nodeId: string, index: number]
  'item-reorder': [fromId: string, toId: string]
}>()

const options = computed(() => props.schema.options || {})

// 从父组件注入拖拽状态
const dragState = inject<any>('dragState', {
  draggingNode: null,
  hoveredNodeId: null,
  dragTarget: null
})

const isHovered = computed(() => dragState.hoveredNodeId === props.schema.id)
const isDragOver = computed(() => dragState.hoveredNodeId === props.schema.id)
const canDropHere = computed(() => {
  if (!dragState.draggingNode) return false
  return true // Form 可以接收表单项和容器
})

const dragTarget = computed(() => {
  if (dragState.dragTarget?.nodeId === props.schema.id) {
    return dragState.dragTarget
  }
  return null
})

const getChildComponent = (child: SchemaNode) => {
  const compMap: Record<string, string> = {
    Container: 'ContainerContainer',
    Form: 'FormContainer',
    Row: 'RowContainer',
    Block: 'BlockContainer'
  }
  return child.type === 'Container' ? compMap[child.component] : `Dynamic${child.component}`
}

const handleUpdate = (field: string, value: any) => {
  if (props.formData) {
    props.formData[field] = value
  }
  emit('update:modelValue', props.formData)
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
  emit('drag-over', props.schema.id, -1)
}

const handleDragLeave = (e: DragEvent) => {
  if (e.target === e.currentTarget) {
    emit('drag-leave')
  }
}

const handleDrop = (e: DragEvent) => {
  e.stopPropagation()
  emit('drop', props.schema.id, -1)
}

const handleItemReorder = (fromId: string, toId: string) => {
  if (!props.schema.children) return

  const children = [...props.schema.children]
  const fromIndex = children.findIndex(child => child.id === fromId)
  const toIndex = children.findIndex(child => child.id === toId)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return

  const [removed] = children.splice(fromIndex, 1)
  children.splice(toIndex, 0, removed)

  props.schema.children = children
  emit('item-reorder', fromId, toId)
}
</script>

<style scoped>
.form-container {
  width: 100%;
  position: relative;
}

.is-build {
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  transition: all 0.3s ease;
  margin: 8px 0;
}

.is-build:hover {
  border-color: #c0c4cc;
}

.is-hovered {
  border-color: #409eff !important;
  background: #ecf5ff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.is-drag-over {
  border-color: #67c23a !important;
  background: #f0f9ff !important;
  box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.2);
}

.container-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 8px;
  gap: 12px;
}

.container-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.container-meta {
  display: flex;
  gap: 8px;
}

.container-actions {
  display: flex;
  gap: 8px;
}

.container-actions .el-button {
  width: 24px;
  height: 24px;
  padding: 0;
}

.container-actions .el-button :deep(.el-icon) {
  font-size: 12px;
}

.form-children-wrapper {
  min-height: 50px;
}

.form-children {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  color: #909399;
  padding: 20px;
}

.empty-icon {
  font-size: 28px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

.drop-indicator {
  height: 4px;
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  border-radius: 2px;
  margin: 4px 0;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.6;
    transform: scaleY(0.8);
  }
}
</style>
