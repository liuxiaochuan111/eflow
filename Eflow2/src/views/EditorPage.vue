<template>
  <div class="editor-page">
    <!-- Top Toolbar -->
    <div class="toolbar">
      <aui-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </aui-button>
      <div class="toolbar-center">
        <aui-input
          v-model="pageUrl"
          placeholder="请输入页面URL"
          style="width: 300px"
        />
        <aui-input
          v-model="pageLabel"
          placeholder="请输入页面标题"
          style="width: 300px; margin-left: 10px"
        />
      </div>
      <div class="toolbar-right">
        <aui-button @click="handlePreview">
          <el-icon><View /></el-icon>
          预览
        </aui-button>
        <aui-button type="primary" @click="handleSave">
          <el-icon><Check /></el-icon>
          保存
        </aui-button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="editor-content">
      <!-- Left Panel - Components -->
      <div class="left-panel">
        <aui-tabs v-model="activeTab" type="border-card">
          <aui-tab-pane label="容器" name="containers">
            <div class="component-list">
              <div
                v-for="container in containers"
                :key="container.type"
                class="component-item"
                draggable="true"
                @dragstart="handleDragStart($event, container)"
              >
                <el-icon><component :is="container.icon" /></el-icon>
                <span>{{ container.label }}</span>
              </div>
            </div>
          </aui-tab-pane>
          <aui-tab-pane label="表单组件" name="form">
            <div class="component-list">
              <div
                v-for="component in formComponents"
                :key="component.type"
                class="component-item"
                draggable="true"
                @dragstart="handleDragStart($event, component)"
              >
                <el-icon><component :is="component.icon" /></el-icon>
                <span>{{ component.label }}</span>
              </div>
            </div>
          </aui-tab-pane>
        </aui-tabs>
      </div>

      <!-- Center Canvas -->
      <div class="center-panel">
        <div
          class="canvas"
          @drop="handleCanvasDrop"
          @dragover="handleCanvasDragOver"
        >
          <div v-if="schema.length === 0" class="canvas-empty">
            <aui-empty description="拖拽左侧组件到此处开始编排" />
          </div>
          <div v-else class="canvas-content">
            <CanvasNode
              v-for="(node, index) in schema"
              :key="node.label"
              :node="node"
              :index="index"
              :selected-node="selectedNode"
              :dragging-item="draggingItem"
              @select="handleSelectNode"
              @delete="handleDeleteNode"
              @dragstart="handleNodeStart"
              @dragend="handleNodeEnd"
              @drop="handleNodeDrop"
            />
          </div>
        </div>
      </div>

      <!-- Right Panel - Properties -->
      <div class="right-panel">
        <aui-card v-if="selectedNode" class="properties-card">
          <template #header>
            <div class="properties-header">
              <span>属性配置</span>
              <aui-tag size="small">{{ selectedNode.type }}</aui-tag>
            </div>
          </template>

          <PropertiesPanel
            v-model="selectedNode"
            :component-def="getComponentDef(selectedNode.type)"
          />
        </aui-card>
        <aui-card v-else class="properties-card">
          <aui-empty description="请选择组件以配置属性" />
        </aui-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import components from '../components'
import {
  ArrowLeft,
  View,
  Check,
  FolderOpened,
  Grid,
  Document,
  Tickets,
  Edit,
  EditPen,
  Select,
  Switch as SwitchIcon,
  Calendar,
  Timer,
  Histogram
} from '@element-plus/icons-vue'
import { createFormFragment, updateFormFragment } from '../api/mock'
import { getComponentSetters } from '../setters'
import CanvasNode from '../components/CanvasNode.vue'
import type { SchemaNode, DragItem } from '../types'

const { AuiMessage: ElMessage } = components

const router = useRouter()
const route = useRoute()

const pageUrl = ref('')
const pageLabel = ref('')
const activeTab = ref('containers')
const schema = ref<SchemaNode[]>([])
const selectedNode = ref<SchemaNode | null>(null)
const currentFragmentId = ref<number | null>(null)
const draggingItem = ref<DragItem | null>(null)
const draggingNode = ref<{ node: SchemaNode; parent: SchemaNode | null; index: number } | null>(null)

// Container components
const containers = ref<DragItem[]>([
  { type: 'Block', label: '区块', isContainer: true, icon: FolderOpened },
  { type: 'Container', label: '容器', isContainer: true, icon: Grid },
  { type: 'Tab', label: '标签页', isContainer: true, icon: Tickets },
  { type: 'TabItem', label: '标签项', isContainer: true, icon: Document },
  { type: 'Row', label: '行', isContainer: true, icon: Edit }
])

// Form components
const formComponents = ref<DragItem[]>([
  { type: 'Input', label: '输入框', isContainer: false, father: ['Row'], icon: EditPen },
  { type: 'Select', label: '下拉框', isContainer: false, father: ['Row'], icon: Select },
  { type: 'Switch', label: '开关', isContainer: false, father: ['Row'], icon: SwitchIcon },
  { type: 'DatePicker', label: '日期选择', isContainer: false, father: ['Row'], icon: Calendar },
  { type: 'TimePicker', label: '时间选择', isContainer: false, father: ['Row'], icon: Timer },
  { type: 'InputNumber', label: '数字输入', isContainer: false, father: ['Row'], icon: Histogram }
])

// Load existing data
onMounted(async () => {
  const id = route.params.id as string
  if (id && id !== 'undefined') {
    currentFragmentId.value = parseInt(id)
    // TODO: Load existing fragment data
  }
})

// Drag and drop handlers
const handleDragStart = (event: DragEvent, item: DragItem) => {
  event.dataTransfer!.effectAllowed = 'copy'
  event.dataTransfer!.setData('component', JSON.stringify(item))
  draggingItem.value = item
}

const handleCanvasDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (draggingItem.value && canDropAtRoot(draggingItem.value)) {
    event.dataTransfer!.dropEffect = 'copy'
  }
}

const handleCanvasDrop = (event: DragEvent) => {
  event.preventDefault()
  const item = draggingItem.value
  if (!item) return

  // Validate nesting rules
  if (!canDropAtRoot(item)) {
    ElMessage.warning('该组件不能放置在根级别，请拖拽到合适的容器中')
    return
  }

  // Get component definition to check for default child
  const componentDef = getComponentSetters(item.type)

  const newNode: SchemaNode = {
    type: item.type,
    label: `${item.type}_${Date.now()}`,
    model: `${item.type}_${Date.now()}`,
    display: true,
    children: item.isContainer ? [] : undefined
  }

  // Add default child for Block and Container
  if (componentDef && (componentDef as any).defaultChild) {
    newNode.children = [{
      ...(componentDef as any).defaultChild,
      label: `Row_${Date.now()}`,
      model: `Row_${Date.now()}`
    }]
  } else if (item.isContainer) {
    newNode.children = []
  }

  schema.value.push(newNode)
  selectedNode.value = newNode
  draggingItem.value = null
}

const handleNodeDrop = (event: DragEvent, targetNode: SchemaNode, targetIndex: number | null) => {
  event.preventDefault()
  event.stopPropagation()

  const item = draggingItem.value
  if (!item) {
    console.log('No dragging item')
    return
  }

  console.log('Dragging item:', item.type, 'to target:', targetNode.type)

  // Validate nesting rules
  const itemDef = getComponentSetters(item.type)
  const targetDef = getComponentSetters(targetNode.type)

  console.log('Item def:', itemDef)
  console.log('Target def:', targetDef)

  if (!itemDef || !targetDef) {
    ElMessage.error('组件定义不存在')
    return
  }

  // 检查嵌套规则 - 简化验证
  if (item.isContainer) {
    console.log('Container validation')
    // 容器组件可以放在Block和Container中
    if (item.type === 'Tab' && targetNode.type !== 'Block') {
      ElMessage.warning('Tab 只能放置在 Block 中')
      return
    }
    if (item.type === 'TabItem' && targetNode.type !== 'Tab') {
      ElMessage.warning('TabItem 只能放置在 Tab 中')
      return
    }
  } else if (itemDef.father && itemDef.father.length > 0) {
    console.log('Form component validation')
    console.log('Item father:', itemDef.father)
    console.log('Target type:', targetNode.type)
    console.log('Includes?', itemDef.father.includes(targetNode.type))
    // 表单组件必须遵循father规则
    if (!itemDef.father.includes(targetNode.type)) {
      ElMessage.warning(`${item.type} 只能放置在 ${itemDef.father.join(', ')} 中，不能放置在 ${targetNode.type} 中`)
      return
    }
  }

  console.log('Validation passed, creating node')

  let newNode: SchemaNode

  // Wrap form components in FormItem
  if (!item.isContainer && itemDef.father && itemDef.father.includes('Row')) {
    // Create FormItem wrapper
    const formItemModel = `FormItem_${Date.now()}`
    newNode = {
      type: 'FormItem',
      label: formItemModel,
      model: formItemModel,
      display: true,
      required: false,
      labelEn: item.type,
      span: 12,
      children: [{
        type: item.type,
        component: item.type,
        model: `${item.type}_${Date.now()}`,
        label: item.type,
        display: true,
        options: {}
      }]
    }
  } else {
    // Create container node
    newNode = {
      type: item.type,
      label: `${item.type}_${Date.now()}`,
      model: `${item.type}_${Date.now()}`,
      display: true,
      children: undefined
    }

    // Add default child for Block and Container
    if (item.isContainer) {
      if ((itemDef as any).defaultChild) {
        newNode.children = [{
          ...(itemDef as any).defaultChild,
          label: `Row_${Date.now()}`,
          model: `Row_${Date.now()}`
        }]
      } else {
        newNode.children = []
      }
    }
  }

  // Add to target's children
  if (!targetNode.children) {
    targetNode.children = []
  }

  if (targetIndex !== null && targetIndex < targetNode.children.length) {
    targetNode.children.splice(targetIndex, 0, newNode)
  } else {
    targetNode.children.push(newNode)
  }

  selectedNode.value = newNode
  draggingItem.value = null
}

const handleNodeStart = (data: any) => {
  if (data.node) {
    draggingNode.value = data
  }
}

const handleNodeEnd = () => {
  draggingNode.value = null
}

const handleSelectNode = (node: SchemaNode) => {
  selectedNode.value = node
}

const handleDeleteNode = (node: SchemaNode) => {
  const deleteFromSchema = (nodes: SchemaNode[]): boolean => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === node) {
        nodes.splice(i, 1)
        return true
      }
      if (nodes[i].children && deleteFromSchema(nodes[i].children!)) {
        return true
      }
    }
    return false
  }

  deleteFromSchema(schema.value)
  if (selectedNode.value === node) {
    selectedNode.value = null
  }
}

// Validate if item can be dropped at root level
const canDropAtRoot = (item: DragItem): boolean => {
  // Containers can always be at root
  if (item.isContainer) return true

  // Form components MUST be in Row, cannot be at root
  if (item.father && item.father.includes('Row')) {
    return false
  }

  // Other components can be at root
  return !item.father || item.father.includes('wrap')
}

// Get component definition
const getComponentDef = (type: string) => {
  return getComponentSetters(type)
}

// Toolbar actions
const handleBack = () => {
  router.push('/')
}

const handlePreview = () => {
  if (!pageUrl.value) {
    ElMessage.warning('请先输入页面URL')
    return
  }
  router.push(`/preview/${pageUrl.value}`)
}

const handleSave = async () => {
  if (!pageUrl.value || !pageLabel.value) {
    ElMessage.warning('请填写页面URL和标题')
    return
  }

  try {
    const fragmentData = {
      url: pageUrl.value,
      label: pageLabel.value,
      schema: schema.value,
      eventConfig: []
    }

    if (currentFragmentId.value) {
      await updateFormFragment(currentFragmentId.value, fragmentData)
      ElMessage.success('更新成功')
    } else {
      const result = await createFormFragment(fragmentData)
      currentFragmentId.value = result.id!
      ElMessage.success('保存成功')
    }

    router.push('/')
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}
</script>

<style scoped>
.editor-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.toolbar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.toolbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.toolbar-right {
  display: flex;
  gap: 10px;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e0e0;
  overflow: auto;
}

.component-list {
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: move;
  transition: all 0.3s;
}

.component-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.component-item .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
  color: #409eff;
}

.component-item span {
  font-size: 12px;
  color: #606266;
}

.center-panel {
  flex: 1;
  background: #f5f5f5;
  overflow: auto;
  padding: 20px;
}

.canvas {
  min-height: 100%;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.canvas-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.canvas-content {
  min-height: 400px;
}

.right-panel {
  width: 320px;
  background: white;
  border-left: 1px solid #e0e0e0;
  overflow: auto;
}

.properties-card {
  height: 100%;
  border: none;
}

.properties-card :deep(.aui-card__header) {
  background: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
}

.properties-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}
</style>
