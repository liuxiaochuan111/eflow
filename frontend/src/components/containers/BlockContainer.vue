<template>
  <div
    class="block-container"
    :class="[
      { 'is-build': isBuild },
      { 'is-hovered': isHovered && canDropHere },
      { 'is-drag-over': isDragOver },
      options.className
    ]"
    :style="containerStyle"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- 装饰性边框和操作按钮 -->
    <div v-if="isBuild" class="container-border">
      <div class="container-label">
        <el-icon><Box /></el-icon>
        <span>Block</span>
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

    <!-- 空状态提示 -->
    <template v-if="isBuild && !schema.children?.length">
      <div class="empty-state">
        <el-icon class="empty-icon"><Plus /></el-icon>
        <span class="empty-text">拖拽组件到此处</span>
      </div>
    </template>

    <!-- 子节点 -->
    <template v-if="schema.children?.length">
      <div class="children-container">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus, Box, Setting, Delete } from '@element-plus/icons-vue'
import type { SchemaNode } from '@/types'
import { useContainerDrag } from '@/composables/useContainerDrag'

interface Props {
  schema: SchemaNode
  isBuild?: boolean
  formData?: Record<string, any>
  eventConfig?: any
  customFuncs?: Record<string, Function>
  className?: string
  style?: string
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

// 使用统一的拖拽处理
const {
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
} = useContainerDrag(props, emit)

const options = computed(() => props.schema.options || {})

const containerStyle = computed(() => {
  const styles: Record<string, string> = {}
  if (options.value.style) {
    if (typeof options.value.style === 'string') {
      options.value.style.split(';').forEach((rule: string) => {
        const [key, value] = rule.split(':').map((s) => s.trim())
        if (key && value) {
          styles[key] = value
        }
      })
    }
  }
  return styles
})

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

const getChildComponent = (child: SchemaNode) => {
  const compMap: Record<string, string> = {
    Container: 'ContainerContainer',
    Form: 'FormContainer',
    Row: 'RowContainer',
    Block: 'BlockContainer'
  }
  return child.type === 'Container' ? compMap[child.component] : `Dynamic${child.component}`
}
</script>

<style scoped>
.block-container {
  position: relative;
  min-height: 50px;
  transition: all 0.3s ease;
}

.is-build {
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  min-height: 100px;
  padding: 16px;
  background: #fafafa;
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

.container-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 10;
}

.container-label {
  color: white;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.container-label .el-icon {
  font-size: 16px;
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

.is-build {
  border: 2px dashed #e4e7ed;
  border-radius: 8px;
  min-height: 100px;
  padding: 44px 16px 16px 16px;
  background: #fafafa;
  transition: all 0.3s ease;
}

.children-container {
  margin-top: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  color: #909399;
}

.empty-icon {
  font-size: 32px;
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
