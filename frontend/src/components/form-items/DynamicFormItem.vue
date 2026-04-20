<template>
  <div
    class="dynamic-form-item"
    :class="[
      { 'is-build': isBuild },
      { 'is-selected': isSelected },
      { 'is-dragging': isDragging }
    ]"
    @click.stop="handleClick"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- 预览模式 -->
    <el-form-item
      v-if="!isBuild"
      :label="schema.label"
      :required="schema.required"
      :prop="schema.model"
    >
      <component
        :is="getElComponent(schema.component)"
        v-model="localValue"
        v-bind="schema.options"
        @change="handleChange('change', $event)"
        @input="handleChange('input', $event)"
        @blur="handleChange('blur', $event)"
        @focus="handleChange('focus', $event)"
      >
        <template v-for="(_, slotName) in $slots" #[slotName]="scope">
          <slot :name="slotName" v-bind="scope" />
        </template>
      </component>
    </el-form-item>

    <!-- 编排模式 -->
    <div v-else class="build-mode-item">
      <div class="item-header">
        <div class="item-drag-handle" title="拖拽调整位置">
          <el-icon><Rank /></el-icon>
        </div>
        <div class="item-label">
          <el-tag size="small" type="primary">{{ schema.component }}</el-tag>
          <span class="label-text">{{ schema.label || '未设置标签' }}</span>
          <el-tag v-if="schema.required" size="small" type="danger">必填</el-tag>
          <el-tag v-if="!schema.display" size="small" type="info">隐藏</el-tag>
        </div>
        <div class="item-actions">
          <el-button
            text
            type="primary"
            size="small"
            :icon="Setting"
            @click.stop="handleConfig"
          >
            配置
          </el-button>
          <el-button
            text
            type="danger"
            size="small"
            :icon="Delete"
            @click.stop="handleDelete"
          >
            删除
          </el-button>
        </div>
      </div>

      <div class="item-preview">
        <component
          :is="getElComponent(schema.component)"
          v-model="localValue"
          v-bind="schema.options"
          disabled
        />
      </div>

      <div class="item-footer">
        <el-tag size="small" type="info" effect="plain">
          <el-icon><Key /></el-icon>
          {{ schema.model || '未设置model' }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElDatePicker,
  ElTimePicker,
  ElRadio,
  ElCheckbox,
  ElSwitch,
  ElSlider,
  ElUpload,
  ElCascader,
  ElTag,
  ElButton,
  ElFormItem,
  ElIcon,
  ElMessage
} from 'element-plus'
import { Setting, Delete, Key, Rank } from '@element-plus/icons-vue'
import type { FormItemNode } from '@/types'

interface Props {
  schema: FormItemNode
  isBuild?: boolean
  formData?: Record<string, any>
  modelValue?: any
}

const props = withDefaults(defineProps<Props>(), {
  isBuild: false,
  formData: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'node-click': [node: FormItemNode]
  'node-delete': [nodeId: string]
  'item-reorder': [fromIndex: number, toIndex: number]
  change: [event: string, value: any]
}>()

// 拖拽状态
const isDragging = ref(false)
const isDragOver = ref(false)

// 从父组件注入的拖拽状态
const dragState = inject<any>('dragState', {
  selectedNode: null
})

const isSelected = computed(() => {
  return dragState.selectedNode?.id === props.schema.id
})

const localValue = computed({
  get: () => {
    if (props.formData && props.schema.model) {
      return props.formData[props.schema.model]
    }
    return props.modelValue
  },
  set: (val) => {
    emit('update:modelValue', val)
    if (props.formData && props.schema.model) {
      props.formData[props.schema.model] = val
    }
  }
})

const getElComponent = (component: string) => {
  const compMap: Record<string, any> = {
    Input: ElInput,
    InputNumber: ElInputNumber,
    Select: ElSelect,
    DatePicker: ElDatePicker,
    TimePicker: ElTimePicker,
    Radio: ElRadio,
    Checkbox: ElCheckbox,
    Switch: ElSwitch,
    Slider: ElSlider,
    Upload: ElUpload,
    Cascader: ElCascader,
    Textarea: ElInput
  }
  return compMap[component] || ElInput
}

const handleChange = (eventName: string, value: any) => {
  emit('change', eventName, value)
}

const handleClick = () => {
  emit('node-click', props.schema)
}

const handleConfig = () => {
  emit('node-click', props.schema)
  ElMessage.info('请在右侧面板配置组件属性')
}

const handleDelete = () => {
  emit('node-delete', props.schema.id)
}

// 拖拽排序功能
const handleDragStart = (e: DragEvent) => {
  if (!props.isBuild) return

  isDragging.value = true

  // 设置拖拽数据
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('text/plain', JSON.stringify({
    type: 'reorder',
    id: props.schema.id
  }))
}

const handleDragEnd = (e: DragEvent) => {
  isDragging.value = false
  isDragOver.value = false
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()

  // 检查是否是重新排序的拖拽
  try {
    const data = JSON.parse(e.dataTransfer!.getData('text/plain'))
    if (data.type === 'reorder' && data.id !== props.schema.id) {
      isDragOver.value = true
    }
  } catch {
    // 忽略解析错误
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()

  isDragOver.value = false

  try {
    const data = JSON.parse(e.dataTransfer!.getData('text/plain'))

    if (data.type === 'reorder' && data.id !== props.schema.id) {
      // 通知父组件进行重新排序
      emit('item-reorder', data.id, props.schema.id)
    }
  } catch (error) {
    console.error('Drop error:', error)
  }
}
</script>

<style scoped>
.dynamic-form-item {
  position: relative;
}

.is-build {
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.item-drag-handle {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: #909399;
  background: #f5f7fa;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.item-drag-handle:hover {
  background: #e4e7ed;
  color: #409eff;
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);
}

.item-drag-handle:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.is-dragging .item-drag-handle {
  cursor: grabbing;
  color: #409eff;
  background: #ecf5ff;
}

.is-dragging {
  opacity: 0.5;
  transform: scale(0.98);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.is-drag-over {
  border-color: #67c23a !important;
  background: #f0f9ff !important;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3) !important;
  border-style: solid !important;
  border-width: 2px !important;
  transform: translateY(-2px);
  z-index: 100;
}

/* 但按钮和可交互元素需要保持可点击 */
.is-build .el-button,
.is-build .el-tag,
.is-build .item-drag-handle {
  pointer-events: auto;
}

.is-build:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.is-selected {
  border-color: #409eff !important;
  background: #ecf5ff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.item-label {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.label-text {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.item-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.item-preview {
  margin-top: 8px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 4px;
}
</style>
