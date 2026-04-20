<template>
  <el-row
    :gutter="options.gutter || 0"
    :justify="options.justify || 'start'"
    :align="options.align || 'top'"
    class="row-container"
    :class="[
      { 'is-build': isBuild },
      { 'is-hovered': isHovered && canDropHere },
      { 'is-drag-over': isDragOver }
    ]"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- Row 标签 -->
    <div v-if="isBuild" class="row-header">
      <div class="row-badge">
        <el-icon><Grid /></el-icon>
        <span>Row ({{ options.gutter || 0 }}px)</span>
      </div>
      <div class="row-actions">
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
    <el-col v-if="isBuild && !schema.children?.length" :span="24">
      <div class="empty-state">
        <el-icon class="empty-icon"><Plus /></el-icon>
        <span class="empty-text">拖拽表单项到栅格容器</span>
      </div>
    </el-col>

    <!-- 子节点容器 -->
    <template v-if="schema.children?.length">
      <template v-for="(child, index) in schema.children" :key="child.id">
        <!-- 拖拽插入指示器 -->
        <el-col
          v-if="isBuild && isDragOver && dragTarget?.index === index"
          :span="child.span || 24"
        >
          <div class="drop-indicator"></div>
        </el-col>

        <el-col :span="child.span || 24">
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
        </el-col>
      </template>

      <!-- 末尾插入指示器 -->
      <el-col
        v-if="isBuild && isDragOver && dragTarget?.index === -1"
        :span="24"
      >
        <div class="drop-indicator"></div>
      </el-col>
    </template>
  </el-row>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { Grid, Plus, Setting, Delete } from '@element-plus/icons-vue'
import { ElRow, ElCol, ElIcon } from 'element-plus'
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

const dragState = inject<any>('dragState', {
  draggingNode: null,
  hoveredNodeId: null,
  dragTarget: null
})

const isHovered = computed(() => dragState.hoveredNodeId === props.schema.id)
const isDragOver = computed(() => dragState.hoveredNodeId === props.schema.id)
const canDropHere = computed(() => {
  if (!dragState.draggingNode) return false
  return true // Row 可以接收表单项
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
.row-container {
  width: 100%;
  position: relative;
  transition: all 0.3s ease;
}

.is-build {
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  margin: 8px 0;
  transition: all 0.3s ease;
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

.row-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 8px;
}

.row-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.row-actions {
  display: flex;
  gap: 8px;
}

.row-actions .el-button {
  width: 24px;
  height: 24px;
  padding: 0;
}

.row-actions .el-button :deep(.el-icon) {
  font-size: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  color: #909399;
  padding: 16px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.empty-icon {
  font-size: 24px;
  margin-bottom: 6px;
  opacity: 0.5;
}

.empty-text {
  font-size: 13px;
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
