<template>
  <div class="builder-page">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="form-info">
          <div class="form-name-input">
            <el-input
              v-model="formName"
              placeholder="请输入表单名称"
              size="default"
              clearable
            >
              <template #prefix>
                <el-icon class="input-icon"><Edit /></el-icon>
              </template>
            </el-input>
          </div>
          <div class="form-id-input">
            <el-input
              v-model="formId"
              placeholder="表单ID"
              disabled
              size="default"
            >
              <template #prefix>
                <el-icon class="input-icon"><Key /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </div>

      <div class="toolbar-right">
        <div v-if="selectedNode" class="selected-node-info">
          <el-tag type="success" effect="light" closable @close="selectedNode = null">
            <el-icon><Check /></el-icon>
            <span class="tag-text">已选择: {{ selectedNode.component }}</span>
          </el-tag>
        </div>

        <div class="toolbar-actions">
          <el-button-group>
            <el-button :icon="View" @click="previewVisible = true">
              <span class="btn-text">预览</span>
            </el-button>
            <el-button :icon="RefreshLeft" @click="handleReset">
              <span class="btn-text">重置</span>
            </el-button>
          </el-button-group>

          <el-button type="primary" :icon="Select" @click="handleSave" size="default">
            <span class="btn-text">保存</span>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <el-tabs v-model="activeTab" class="component-tabs">
          <el-tab-pane name="containers">
            <template #label>
              <span class="tab-label">
                <el-icon><Box /></el-icon>
                <span>容器</span>
              </span>
            </template>
            <div class="component-list">
              <div
                v-for="container in CONTAINER_CONFIG"
                :key="container.name"
                class="component-card container-card"
                draggable="true"
                @dragstart="onDragStart(container, 'container')"
                @dragend="onDragEnd"
              >
                <div class="card-icon" :style="{ background: getGradient(container.name) }">
                  <el-icon :size="24"><component :is="container.icon" /></el-icon>
                </div>
                <div class="card-info">
                  <div class="card-title">{{ container.label }}</div>
                  <div class="card-subtitle">{{ container.labelEn }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane name="formItems">
            <template #label>
              <span class="tab-label">
                <el-icon><List /></el-icon>
                <span>表单项</span>
              </span>
            </template>
            <div class="component-list">
              <div
                v-for="item in FORM_ITEM_CONFIG"
                :key="item.name"
                class="component-card formitem-card"
                draggable="true"
                @dragstart="onDragStart(item, 'formItem')"
                @dragend="onDragEnd"
              >
                <div class="card-icon" :style="{ background: getGradient(item.name) }">
                  <el-icon :size="22"><component :is="item.icon" /></el-icon>
                </div>
                <div class="card-info">
                  <div class="card-title">{{ item.label }}</div>
                  <div class="card-subtitle">{{ item.labelEn }}</div>
                </div>
                <div class="card-events">
                  <el-tag size="small" type="info">{{ item.events.length }} 事件</el-tag>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane name="structure">
            <template #label>
              <span class="tab-label">
                <el-icon><Operation /></el-icon>
                <span>结构</span>
              </span>
            </template>
            <div class="structure-tree">
              <el-tree
                :data="schemaTreeData"
                :props="{ label: 'label', children: 'children' }"
                default-expand-all
                :expand-on-click-node="false"
                node-key="id"
              >
                <template #default="{ node, data }">
                  <div class="tree-node" @click="handleTreeNodeClick(data)">
                    <el-icon>
                      <component :is="getIcon(data.type)" />
                    </el-icon>
                    <span>{{ data.label }}</span>
                    <el-tag v-if="data.type === 'FormItem'" size="small" type="success">
                      {{ data.model }}
                    </el-tag>
                  </div>
                </template>
              </el-tree>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 中间画布 -->
      <div class="canvas">
        <div class="canvas-header">
          <div class="canvas-title">
            <el-icon class="title-icon"><Grid /></el-icon>
            <span>表单画布</span>
          </div>
          <div v-if="draggingLabel" class="dragging-indicator">
            <el-tag type="warning" effect="light">
              <el-icon class="tag-icon"><Warning /></el-icon>
              <span>正在拖拽: {{ draggingLabel }}</span>
            </el-tag>
          </div>
        </div>

        <div class="canvas-inner" @dragover.prevent @drop.prevent>
          <FormBuilder
            ref="formBuilderRef"
            v-model="formData"
            :schema="currentSchema"
            :event-config="eventConfig"
            :is-build="true"
            @render-end="handleRenderEnd"
            @update:schema="handleSchemaUpdate"
            @node-click="handleNodeClick"
            @node-delete="handleNodeDelete"
          >
            <template #default>
              <div
                v-if="!currentSchema?.children?.length"
                class="canvas-empty"
                :class="{ 'is-dragging': draggingLabel }"
              >
                <div class="empty-content">
                  <div class="empty-illustration">
                    <el-icon class="empty-icon-main"><Plus /></el-icon>
                    <div class="empty-icon-dots">
                      <div class="dot dot-1"></div>
                      <div class="dot dot-2"></div>
                      <div class="dot dot-3"></div>
                    </div>
                  </div>
                  <p class="empty-title">开始构建您的表单</p>
                  <p class="empty-description">从左侧拖拽组件到此处开始编排</p>
                  <div class="empty-tips">
                    <el-tag size="small" type="info">支持容器和表单项</el-tag>
                    <el-tag size="small" type="info">实时预览</el-tag>
                    <el-tag size="small" type="info">拖拽排序</el-tag>
                  </div>
                </div>
              </div>
            </template>
          </FormBuilder>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="right-panel">
        <el-tabs v-model="activeRightTab" class="right-tabs">
          <el-tab-pane name="props">
            <template #label>
              <span class="tab-label">
                <el-icon><Setting /></el-icon>
                <span>属性配置</span>
              </span>
            </template>
            <PropsConfigPanel
              :selected-node="selectedNode"
              @update:selected-node="handleUpdateSelectedNode"
              @prop-change="handlePropChange"
            />
          </el-tab-pane>

          <el-tab-pane name="events">
            <template #label>
              <span class="tab-label">
                <el-icon><Connection /></el-icon>
                <span>事件配置</span>
              </span>
            </template>
            <EventPanel
              :selected-node="selectedNode"
              :event-config="eventConfig"
              :all-nodes="allFormItems"
              @update:event-config="handleEventConfigUpdate"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="表单预览"
      width="90%"
      top="5vh"
      :close-on-click-modal="false"
    >
      <div class="preview-container">
        <!-- 设备切换工具栏 -->
        <div class="preview-toolbar">
          <el-radio-group v-model="previewDevice" size="small">
            <el-radio-button value="pc">
              <el-icon><Monitor /></el-icon>
              <span>PC</span>
            </el-radio-button>
            <el-radio-button value="tablet">
              <el-icon><Iphone /></el-icon>
              <span>平板</span>
            </el-radio-button>
            <el-radio-button value="mobile">
              <el-icon><Cellphone /></el-icon>
              <span>手机</span>
            </el-radio-button>
          </el-radio-group>

          <el-tag type="info" size="small">
            {{ getDeviceSize(previewDevice) }}
          </el-tag>
        </div>

        <!-- 预览区域 -->
        <div class="preview-content" :class="`preview-${previewDevice}`">
          <div class="preview-frame">
            <FormBuilder
              v-if="currentSchema"
              v-model="previewData"
              :schema="currentSchema"
              :event-config="eventConfig"
              :is-build="false"
              @render-end="handleRenderEnd"
            />
          </div>
        </div>

        <!-- 实时数据显示 -->
        <div class="preview-data">
          <el-collapse>
            <el-collapse-item title="查看实时数据" name="data">
              <el-tabs v-model="activePreviewTab" type="border-card">
                <el-tab-pane label="表单数据" name="formData">
                  <pre class="json-pre">{{ JSON.stringify(previewData, null, 2) }}</pre>
                </el-tab-pane>
                <el-tab-pane label="Schema" name="schema">
                  <pre class="json-pre">{{ JSON.stringify(currentSchema, null, 2) }}</pre>
                </el-tab-pane>
                <el-tab-pane label="事件配置" name="eventConfig">
                  <pre class="json-pre">{{ JSON.stringify(eventConfig, null, 2) }}</pre>
                </el-tab-pane>
              </el-tabs>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  View,
  Select,
  RefreshLeft,
  Edit,
  Key,
  Box,
  List,
  Operation,
  Plus,
  Warning,
  Grid,
  Document,
  Check,
  Setting,
  Connection,
  Monitor,
  Iphone,
  Cellphone
} from '@element-plus/icons-vue'
import FormBuilder from '@/components/builder/FormBuilder.vue'
import PropsConfigPanel from '@/components/panels/PropsConfigPanel.vue'
import EventPanel from '@/components/panels/EventPanel.vue'
import { CONTAINER_CONFIG, FORM_ITEM_CONFIG } from '@/configs'
import { getFormById, createForm, updateForm } from '@/api/form'
import type { SchemaTree, EventConfig, SchemaNode } from '@/types'

const route = useRoute()
const formBuilderRef = ref()
const formId = ref('')
const formName = ref('新建表单')
const currentSchema = ref<SchemaTree | null>(null)
const eventConfig = ref<EventConfig>({})
const formData = ref<Record<string, any>>({})
const previewData = ref<Record<string, any>>({})
const selectedNode = ref<SchemaNode | null>(null)
const activeTab = ref('containers')
const activeRightTab = ref('props')
const activePreviewTab = ref('formData')
const previewVisible = ref(false)
const previewDevice = ref<'pc' | 'tablet' | 'mobile'>('pc')

// 拖拽状态
const draggingLabel = ref('')

// Schema 树数据（用于左侧结构树）
const schemaTreeData = computed(() => {
  if (!currentSchema.value) return []

  const buildTree = (node: any): any => {
    const treeNode: any = {
      id: node.id,
      label: node.component,
      type: node.type,
      model: node.model,
      children: []
    }

    if (node.children?.length) {
      treeNode.children = node.children.map((child: any) => buildTree(child))
    }

    return treeNode
  }

  return [buildTree(currentSchema.value)]
})

// 获取所有表单项节点（用于事件配置的目标选择）
const allFormItems = computed<SchemaNode[]>(() => {
  const items: SchemaNode[] = []

  const traverse = (node: SchemaNode) => {
    if (node.type === 'FormItem') {
      items.push(node)
    }
    if (node.children?.length) {
      node.children.forEach(traverse)
    }
  }

  if (currentSchema.value) {
    traverse(currentSchema.value)
  }

  return items
})

// 获取图标
const getIcon = (type: string) => {
  const icons: Record<string, any> = {
    Container: Box,
    FormItem: List,
    Block: Box,
    Form: Document,
    Row: Grid
  }
  return icons[type] || Box
}

// 获取渐变色
const getGradient = (name: string) => {
  const gradients: Record<string, string> = {
    Block: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    Container: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    Form: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    Row: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    Input: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    Select: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    DatePicker: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    Switch: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  }
  return gradients[name] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

// 获取设备尺寸
const getDeviceSize = (device: 'pc' | 'tablet' | 'mobile') => {
  const sizes = {
    pc: '100% (1920x1080)',
    tablet: '768px (768x1024)',
    mobile: '375px (375x667)'
  }
  return sizes[device]
}

// 拖拽事件
const onDragStart = (config: any, type: 'container' | 'formItem') => {
  draggingLabel.value = config.label

  // 创建拖拽节点
  const draggingNode: any = {
    id: `new_${config.name}_${Date.now()}`,
    type: config.type,
    component: config.name,
    display: true,
    options: { ...(config.defaultOptions || {}) },
    children: config.type === 'Container' ? [] : undefined
  }

  // 如果是表单项，添加默认属性
  if (config.type === 'FormItem') {
    draggingNode.model = `${config.name.toLowerCase()}_${Date.now()}`
    draggingNode.label = config.label
    draggingNode.required = false
  }

  // 通知 FormBuilder 开始拖拽
  if (formBuilderRef.value) {
    formBuilderRef.value.setDraggingNode(draggingNode)
  }
}

const onDragEnd = () => {
  draggingLabel.value = ''
  if (formBuilderRef.value) {
    formBuilderRef.value.setDraggingNode(null)
  }
}

// 加载表单
const loadForm = async (id: string) => {
  try {
    const res = await getFormById(id)
    if (res.code === 200) {
      formId.value = res.data.id
      formName.value = res.data.name
      currentSchema.value = res.data.schema
      eventConfig.value = res.data.eventConfig
    }
  } catch (error) {
    ElMessage.error('加载表单失败')
  }
}

// 保存表单
const handleSave = async () => {
  if (!currentSchema.value) return

  try {
    const data = {
      name: formName.value,
      schema: currentSchema.value,
      eventConfig: eventConfig.value
    }

    let res
    if (formId.value) {
      res = await updateForm(formId.value, data)
    } else {
      res = await createForm(data)
      if (res.code === 200) {
        formId.value = res.data.id
      }
    }

    if (res.code === 200) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 重置表单
const handleReset = () => {
  currentSchema.value = {
    id: 'root',
    type: 'Container',
    component: 'Container',
    display: true,
    options: {},
    children: []
  }
  eventConfig.value = {}
  selectedNode.value = null
  ElMessage.info('已重置表单')
}

// Schema 更新
const handleSchemaUpdate = (newSchema: SchemaTree) => {
  currentSchema.value = newSchema
}

// 节点点击
const handleNodeClick = (node: SchemaNode) => {
  selectedNode.value = node
  activeRightTab.value = 'props'
  ElMessage.success(`已选择: ${node.component}`)
}

// 节点删除
const handleNodeDelete = (nodeId: string) => {
  ElMessage.success('组件已删除')
  selectedNode.value = null
}

// 树节点点击
const handleTreeNodeClick = (data: any) => {
  const node = findNodeInSchema(currentSchema.value, data.id)
  if (node) {
    handleNodeClick(node)
  }
}

// 在 Schema 中查找节点
const findNodeInSchema = (schema: any, id: string): any => {
  if (schema.id === id) return schema
  if (schema.children) {
    for (const child of schema.children) {
      const found = findNodeInSchema(child, id)
      if (found) return found
    }
  }
  return null
}

// 属性变更
const handlePropChange = () => {
  // 触发 schema 更新
  if (currentSchema.value) {
    currentSchema.value = { ...currentSchema.value }
  }
}

// 事件配置变更
const handleEventConfigUpdate = (newConfig: EventConfig) => {
  eventConfig.value = newConfig
}

const handleUpdateSelectedNode = (node: SchemaNode | null) => {
  selectedNode.value = node
}

const handleRenderEnd = () => {
  console.log('Form rendered')
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    loadForm(id)
  } else {
    handleReset()
  }
})
</script>

<style scoped>
.builder-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  overflow: hidden;
}

/* 顶部工具栏 */
.toolbar {
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.form-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.form-name-input {
  width: 280px;
}

.form-id-input {
  width: 240px;
}

.form-name-input :deep(.el-input__wrapper),
.form-id-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s;
}

.form-name-input :deep(.el-input__wrapper:hover),
.form-id-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.input-icon {
  color: #909399;
  font-size: 16px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.selected-node-info {
  display: flex;
  align-items: center;
}

.tag-text {
  margin-left: 6px;
  font-weight: 500;
}

.toolbar-actions {
  display: flex;
  gap: 12px;
}

.toolbar-actions .el-button-group {
  display: flex;
}

.btn-text {
  margin-left: 4px;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧面板 */
.left-panel {
  width: 300px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.component-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.component-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 16px 16px 0;
  background: #fafbfc;
}

.component-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.component-tabs :deep(.el-tabs__item) {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s;
}

.component-tabs :deep(.el-tabs__item:hover) {
  color: var(--el-color-primary);
}

.component-tabs :deep(.el-tabs__item.is-active) {
  color: var(--el-color-primary);
  font-weight: 500;
}

.component-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 2px;
}

.component-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.component-tabs :deep(.el-tab-pane) {
  height: 100%;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.component-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.component-card {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  background: white;
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  position: relative;
  overflow: hidden;
}

.component-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.05) 0%, rgba(64, 158, 255, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.component-card:hover::before {
  opacity: 1;
}

.component-card:hover {
  border-color: #409eff;
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.2);
  transform: translateY(-3px) scale(1.02);
}

.component-card:active {
  cursor: grabbing;
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.card-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 14px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}

.card-icon::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  padding: 2px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.card-info {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  letter-spacing: 0.3px;
}

.card-subtitle {
  font-size: 12px;
  color: #909399;
  font-weight: 400;
  letter-spacing: 0.2px;
}

.card-events {
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

/* 结构树 */
.structure-tree {
  padding: 16px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s;
  color: #606266;
}

.tree-node:hover {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  color: #303133;
  transform: translateX(4px);
}

/* 中间画布 */
.canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f0f2f5 0%, #e8eef5 100%);
  position: relative;
}

.canvas-header {
  height: 56px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.canvas-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.title-icon {
  font-size: 20px;
  color: #409eff;
}

.dragging-indicator {
  display: flex;
  align-items: center;
}

.tag-icon {
  margin-right: 6px;
}

.canvas-inner {
  flex: 1;
  padding: 24px;
  overflow: auto;
}

/* 空状态优化 */
.canvas-empty {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px dashed #dcdfe6;
  border-radius: 16px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.canvas-empty::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(64, 158, 255, 0.03) 100%);
  opacity: 0;
  transition: opacity 0.4s;
}

.canvas-empty:hover::before {
  opacity: 1;
}

.canvas-empty.is-dragging {
  border-color: #409eff;
  border-style: solid;
  background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.2);
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% {
    box-shadow: 0 8px 32px rgba(64, 158, 255, 0.2);
  }
  50% {
    box-shadow: 0 8px 48px rgba(64, 158, 255, 0.4);
  }
}

.empty-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.empty-illustration {
  position: relative;
  margin-bottom: 24px;
}

.empty-icon-main {
  font-size: 64px;
  color: #409eff;
  opacity: 0.3;
}

.empty-icon-dots {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #409eff;
  opacity: 0;
}

.dot-1 {
  animation: dot-pulse-1 2s ease-in-out infinite;
}

.dot-2 {
  animation: dot-pulse-2 2s ease-in-out infinite 0.3s;
}

.dot-3 {
  animation: dot-pulse-3 2s ease-in-out infinite 0.6s;
}

@keyframes dot-pulse-1 {
  0%, 100% {
    transform: translate(-24px, -8px) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(-24px, -8px) scale(1);
    opacity: 0.6;
  }
}

@keyframes dot-pulse-2 {
  0%, 100% {
    transform: translate(0, -20px) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(0, -20px) scale(1);
    opacity: 0.6;
  }
}

@keyframes dot-pulse-3 {
  0%, 100% {
    transform: translate(24px, -8px) scale(0);
    opacity: 0;
  }
  50% {
    transform: translate(24px, -8px) scale(1);
    opacity: 0.6;
  }
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.empty-description {
  font-size: 14px;
  color: #909399;
  margin-bottom: 20px;
}

.empty-tips {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 右侧面板 */
.right-panel {
  width: 380px;
  background: white;
  border-left: 1px solid #e4e7ed;
  overflow: hidden;
}

.right-tabs {
  height: 100%;
}

.right-tabs :deep(.el-tabs__content) {
  height: calc(100% - 55px);
  overflow: auto;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.events-hint {
  font-size: 13px;
  color: #909399;
  line-height: 1.6;
}

/* 预览相关样式 */
.preview-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.preview-toolbar :deep(.el-radio-group) {
  display: flex;
  gap: 8px;
}

.preview-toolbar :deep(.el-radio-button__inner) {
  display: flex;
  align-items: center;
  gap: 6px;
}

.preview-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 500px;
  background: #f0f2f5;
  border-radius: 8px;
  padding: 20px;
  overflow: auto;
}

.preview-frame {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.preview-pc .preview-frame {
  width: 100%;
}

.preview-tablet .preview-frame {
  width: 768px;
  max-height: 1024px;
  overflow-y: auto;
}

.preview-mobile .preview-frame {
  width: 375px;
  max-height: 667px;
  overflow-y: auto;
}

.preview-data {
  background: #f5f7fa;
  border-radius: 4px;
}

.json-pre {
  background: #fff;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: 400px;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
}
</style>
