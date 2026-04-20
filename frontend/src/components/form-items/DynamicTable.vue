<template>
  <div
    class="dynamic-table"
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
    <el-table
      v-if="!isBuild"
      :data="tableData"
      :border="options.border || false"
      :stripe="options.stripe || false"
      :size="options.size || 'default'"
      :show-header="options.showHeader !== false"
      :highlight-current-row="options.highlightCurrentRow || false"
      :max-height="options.maxHeight"
      :fit="options.fit !== false"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="options.showSelection"
        type="selection"
        width="55"
      />

      <!-- 索引列 -->
      <el-table-column
        v-if="options.showIndex"
        type="index"
        width="60"
        :label="options.indexLabel || '序号'"
      />

      <!-- 动态列 -->
      <template v-for="(column, index) in columns" :key="index">
        <el-table-column
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :align="column.align || 'left'"
          :resizable="column.resizable !== false"
        >
          <template v-if="column.slot" #default="scope">
            <slot :name="column.slot" :row="scope.row" :column="column" :$index="scope.$index">
              {{ scope.row[column.prop] }}
            </slot>
          </template>
        </el-table-column>
      </template>

      <!-- 操作列 -->
      <el-table-column
        v-if="options.showActions"
        :label="options.actionLabel || '操作'"
        :width="options.actionWidth || 120"
        :fixed="options.actionFixed || 'right'"
      >
        <template #default="scope">
          <slot name="actions" :row="scope.row" :$index="scope.$index">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row, scope.$index)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row, scope.$index)"
            >
              删除
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编排模式 -->
    <div v-else class="build-mode-table">
      <div class="table-header">
        <div class="table-drag-handle" title="拖拽调整位置">
          <el-icon><Rank /></el-icon>
        </div>
        <div class="table-label">
          <el-tag size="small" type="success">Table</el-tag>
          <span class="label-text">{{ schema.label || '未设置标签' }}</span>
          <el-tag v-if="schema.required" size="small" type="danger">必填</el-tag>
        </div>
        <div class="table-actions">
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
            @click.stop="handleDeleteItem"
          >
            删除
          </el-button>
        </div>
      </div>

      <div class="table-preview">
        <div class="preview-table">
          <div class="preview-header">
            <div v-if="options.showSelection" class="preview-cell selection">
              <el-checkbox />
            </div>
            <div v-if="options.showIndex" class="preview-cell index">#</div>
            <div
              v-for="(column, index) in columns.slice(0, 4)"
              :key="index"
              class="preview-cell"
            >
              {{ column.label || `列${index + 1}` }}
            </div>
            <div v-if="columns.length > 4" class="preview-cell">
              +{{ columns.length - 4 }}
            </div>
          </div>
          <div class="preview-body">
            <div v-for="index in 3" :key="index" class="preview-row">
              <div v-if="options.showSelection" class="preview-cell selection">
                <el-checkbox />
              </div>
              <div v-if="options.showIndex" class="preview-cell index">{{ index }}</div>
              <div
                v-for="(column, colIndex) in columns.slice(0, 4)"
                :key="colIndex"
                class="preview-cell"
              >
                {{ getColumnPreview(column, index) }}
              </div>
              <div v-if="columns.length > 4" class="preview-cell">...</div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-footer">
        <el-tag size="small" type="info" effect="plain">
          <el-icon><Key /></el-icon>
          {{ schema.model || '未设置model' }}
        </el-tag>
        <el-tag size="small" type="info" effect="plain">
          {{ columns.length }} 列
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElTag,
  ElIcon,
  ElCheckbox,
  ElMessage
} from 'element-plus'
import { Setting, Delete, Key, Rank } from '@element-plus/icons-vue'
import type { FormItemNode } from '@/types'

interface TableColumn {
  prop: string
  label: string
  width?: number
  minWidth?: number
  fixed?: string
  sortable?: boolean | string
  align?: string
  resizable?: boolean
  slot?: string
}

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

const options = computed(() => props.schema.options || {})

const columns = computed<TableColumn[]>(() => {
  try {
    if (typeof options.value.columns === 'string') {
      return JSON.parse(options.value.columns)
    }
    return options.value.columns || []
  } catch {
    return []
  }
})

const tableData = computed(() => {
  if (props.formData && props.schema.model) {
    const data = props.formData[props.schema.model]
    if (Array.isArray(data)) {
      return data
    }
  }
  // 返回默认示例数据
  return Array.from({ length: 3 }, (_, i) => {
    const row: any = {}
    columns.value.forEach((col) => {
      row[col.prop] = `${col.label}-${i + 1}`
    })
    return row
  })
})

const getColumnPreview = (column: TableColumn, index: number) => {
  const preview = `${column.label || '列'}-${index}`
  return preview.length > 8 ? preview.substring(0, 8) + '...' : preview
}

const handleSelectionChange = (selection: any[]) => {
  emit('change', 'selection-change', selection)
}

const handleSortChange = (sort: any) => {
  emit('change', 'sort-change', sort)
}

const handleFilterChange = (filters: any) => {
  emit('change', 'filter-change', filters)
}

const handleEdit = (row: any, index: number) => {
  emit('change', 'edit', { row, index })
}

const handleDelete = (row: any, index: number) => {
  emit('change', 'delete-row', { row, index })
}

const handleClick = () => {
  emit('node-click', props.schema)
}

const handleConfig = () => {
  emit('node-click', props.schema)
  ElMessage.info('请在右侧面板配置表格属性')
}

const handleDeleteItem = () => {
  emit('node-delete', props.schema.id)
}

// 拖拽排序功能
const handleDragStart = (e: DragEvent) => {
  if (!props.isBuild) return

  isDragging.value = true

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
      emit('item-reorder', data.id, props.schema.id)
    }
  } catch (error) {
    console.error('Drop error:', error)
  }
}
</script>

<style scoped>
.dynamic-table {
  position: relative;
  width: 100%;
}

.is-build {
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.is-build:hover {
  border-color: #c0c4cc;
}

.is-selected {
  border-color: #409eff !important;
  background: #ecf5ff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
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

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.table-drag-handle {
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

.table-drag-handle:hover {
  background: #e4e7ed;
  color: #409eff;
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);
}

.table-drag-handle:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.table-label {
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

.table-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.table-preview {
  margin-top: 8px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  overflow-x: auto;
}

.preview-table {
  min-width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  font-weight: 500;
  color: #606266;
}

.preview-row {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}

.preview-row:last-child {
  border-bottom: none;
}

.preview-cell {
  flex: 1;
  min-width: 80px;
  padding: 8px 12px;
  border-right: 1px solid #ebeef5;
  font-size: 13px;
  color: #606266;
  display: flex;
  align-items: center;
}

.preview-cell:last-child {
  border-right: none;
}

.preview-cell.selection,
.preview-cell.index {
  min-width: 50px;
  width: 50px;
  justify-content: center;
  flex-shrink: 0;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 4px;
  gap: 8px;
}

/* 保持按钮和标签可点击 */
.is-build .el-button,
.is-build .el-tag,
.is-build .table-drag-handle {
  pointer-events: auto;
}
</style>