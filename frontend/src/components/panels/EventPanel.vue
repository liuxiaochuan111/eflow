<template>
  <div class="event-panel">
    <div v-if="!selectedNode" class="empty-state">
      <el-icon class="empty-icon"><Connection /></el-icon>
      <p class="empty-text">请选择一个表单项</p>
      <p class="empty-hint">选择后可配置事件联动</p>
    </div>

    <div v-else class="event-content">
      <div class="event-header">
        <el-tag type="primary">{{ selectedNode.component }}</el-tag>
        <span class="model-name">{{ selectedNode.model || '未设置model' }}</span>
      </div>

      <div class="event-tabs">
        <el-tabs v-model="activeEventTab" type="border-card">
          <el-tab-pane
            v-for="eventName in availableEvents"
            :key="eventName"
            :label="getEventLabel(eventName)"
            :name="eventName"
          >
            <div class="event-actions">
              <div class="actions-header">
                <span class="actions-title">{{ getEventLabel(eventName) }}事件</span>
                <el-button
                  type="primary"
                  size="small"
                  :icon="Plus"
                  @click="addEventAction(eventName)"
                >
                  添加动作
                </el-button>
              </div>

              <div v-if="!eventActions.length" class="actions-empty">
                <el-empty description="暂无事件动作，点击上方按钮添加" :image-size="80" />
              </div>

              <div v-else class="actions-list">
                <div
                  v-for="(action, index) in eventActions"
                  :key="index"
                  class="action-item"
                >
                  <div class="action-header">
                    <span class="action-index">#{{ index + 1 }}</span>
                    <el-button
                      type="danger"
                      size="small"
                      :icon="Delete"
                      circle
                      @click="removeEventAction(eventName, index)"
                    />
                  </div>

                  <div class="action-form">
                    <el-form :model="action" label-width="80px" size="small">
                      <!-- 目标 -->
                      <el-form-item label="目标">
                        <el-select
                          v-model="action.target"
                          placeholder="选择目标"
                          @change="onTargetChange(action, index)"
                        >
                          <el-option label="当前控件" value="self" />
                          <el-option
                            v-for="item in availableTargets"
                            :key="item.model"
                            :label="`${item.label} (${item.model})`"
                            :value="item.model"
                          />
                        </el-select>
                      </el-form-item>

                      <!-- 方法 -->
                      <el-form-item label="方法">
                        <el-select v-model="action.method" placeholder="选择方法">
                          <el-option label="设置属性 (set)" value="set" />
                          <el-option label="执行函数 (call)" value="call" />
                          <el-option label="数据映射 (map)" value="map" />
                        </el-select>
                      </el-form-item>

                      <!-- 属性设置 (set方法) -->
                      <template v-if="action.method === 'set'">
                        <el-form-item label="属性名">
                          <el-select v-model="action.props.prop" placeholder="选择属性">
                            <el-option label="显示 (display)" value="display" />
                            <el-option label="禁用 (disabled)" value="disabled" />
                            <el-option label="必填 (required)" value="required" />
                            <el-option label="值 (value)" value="value" />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="属性值">
                          <el-input
                            v-model="action.props.value"
                            placeholder="输入属性值"
                            clearable
                          />
                        </el-form-item>
                      </template>

                      <!-- 函数执行 (call方法) -->
                      <template v-if="action.method === 'call'">
                        <el-form-item label="函数名">
                          <el-select v-model="action.props.functionName" placeholder="选择函数">
                            <el-option
                              v-for="func in availableFunctions"
                              :key="func.name"
                              :label="func.label"
                              :value="func.name"
                            />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="参数">
                          <el-input
                            v-model="action.props.args"
                            type="textarea"
                            :rows="2"
                            placeholder="JSON格式的参数数组"
                          />
                        </el-form-item>
                      </template>

                      <!-- 数据映射 (map方法) -->
                      <template v-if="action.method === 'map'">
                        <el-form-item label="数据源">
                          <el-input
                            v-model="action.props.source"
                            placeholder="例如：State.model1"
                            clearable
                          />
                        </el-form-item>
                      </template>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="event-hint">
        <el-alert
          type="info"
          :closable="false"
          show-icon
        >
          <template #title>
            <div class="hint-content">
              <p><strong>事件联动说明：</strong></p>
              <ul>
                <li><strong>set</strong> - 设置目标控件的属性值</li>
                <li><strong>call</strong> - 调用自定义函数</li>
                <li><strong>map</strong> - 将数据源映射到目标控件</li>
              </ul>
            </div>
          </template>
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus, Delete, Connection } from '@element-plus/icons-vue'
import { FORM_ITEM_CONFIG } from '@/configs'
import type { SchemaNode, EventConfig, EventAction } from '@/types'

interface Props {
  selectedNode: SchemaNode | null
  eventConfig: EventConfig
  allNodes?: SchemaNode[]
}

interface Emits {
  (e: 'update:eventConfig', value: EventConfig): void
}

const props = withDefaults(defineProps<Props>(), {
  allNodes: () => []
})

const emit = defineEmits<Emits>()

const activeEventTab = ref('change')

// 获取当前选中节点的事件配置
const currentNodeConfig = computed(() => {
  if (!props.selectedNode?.model) return null
  const model = props.selectedNode.model

  if (!props.eventConfig[model]) {
    return {}
  }

  return props.eventConfig[model]
})

// 获取当前标签页的事件动作
const eventActions = computed({
  get: () => {
    if (!currentNodeConfig.value) return []
    const actions = currentNodeConfig.value[activeEventTab.value]
    return actions || []
  },
  set: (value) => {
    updateEventConfig(activeEventTab.value, value)
  }
})

// 获取当前组件可用的事件
const availableEvents = computed(() => {
  if (!props.selectedNode) return []

  const config = FORM_ITEM_CONFIG.find(item => item.name === props.selectedNode?.component)
  return config?.events || []
})

// 获取所有可用的目标节点
const availableTargets = computed(() => {
  return props.allNodes.filter(node =>
    node.type === 'FormItem' &&
    node.model &&
    node.id !== props.selectedNode?.id
  )
})

// 可用的自定义函数
const availableFunctions = ref([
  { name: 'handleSubmit', label: '提交表单' },
  { name: 'handleReset', label: '重置表单' },
  { name: 'validateForm', label: '验证表单' },
  { name: 'calculateTotal', label: '计算总计' },
  { name: 'fetchData', label: '获取数据' }
])

// 获取事件标签
const getEventLabel = (eventName: string) => {
  const labels: Record<string, string> = {
    change: '值改变',
    input: '输入',
    blur: '失焦',
    focus: '聚焦',
    clear: '清空',
    visibleChange: '显示改变',
    removeTag: '移除标签',
    click: '点击'
  }
  return labels[eventName] || eventName
}

// 添加事件动作
const addEventAction = (eventName: string) => {
  const newAction: EventAction = {
    target: 'self',
    method: 'set',
    props: {
      prop: 'display',
      value: 'true'
    }
  }

  const currentActions = eventActions.value
  updateEventConfig(eventName, [...currentActions, newAction])
}

// 移除事件动作
const removeEventAction = (eventName: string, index: number) => {
  const currentActions = [...eventActions.value]
  currentActions.splice(index, 1)
  updateEventConfig(eventName, currentActions)
}

// 更新事件配置
const updateEventConfig = (eventName: string, actions: any[]) => {
  if (!props.selectedNode?.model) return

  const newConfig = { ...props.eventConfig }
  const model = props.selectedNode.model

  if (!newConfig[model]) {
    newConfig[model] = {}
  }

  newConfig[model][eventName] = actions

  emit('update:eventConfig', newConfig)
}

// 目标改变时的处理
const onTargetChange = (action: EventAction, index: number) => {
  // 根据目标类型设置默认值
  if (action.target !== 'self' && action.method === 'set') {
    action.props = {
      prop: 'display',
      value: 'false'
    }
  }
}
</script>

<style scoped>
.event-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
}

.empty-icon {
  font-size: 72px;
  color: #c0c4cc;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-text {
  font-size: 18px;
  color: #303133;
  margin-bottom: 8px;
  font-weight: 600;
}

.empty-hint {
  font-size: 14px;
  color: #909399;
}

/* 事件内容 */
.event-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 事件头部 */
.event-header {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  gap: 14px;
}

.model-name {
  font-size: 15px;
  color: #606266;
  font-weight: 500;
  padding: 6px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

/* 事件标签页 */
.event-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.event-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 16px;
  background: white;
}

.event-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.event-tabs :deep(.el-tabs__item) {
  padding: 0 20px;
  height: 44px;
  line-height: 44px;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s;
}

.event-tabs :deep(.el-tabs__item:hover) {
  color: var(--el-color-primary);
}

.event-tabs :deep(.el-tabs__item.is-active) {
  color: var(--el-color-primary);
  font-weight: 600;
}

.event-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 2px;
}

.event-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
}

.event-tabs :deep(.el-tab-pane) {
  height: 100%;
}

/* 事件动作 */
.event-actions {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.actions-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}

.actions-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.actions-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.actions-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 动作项 */
.action-item {
  border: 2px solid #e4e7ed;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.action-item:hover::before {
  transform: scaleX(1);
}

.action-item:hover {
  border-color: #409eff;
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.action-index {
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.action-form {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.action-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.action-form :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

.action-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.action-form :deep(.el-input__wrapper),
.action-form :deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
  transition: all 0.3s;
}

.action-form :deep(.el-input__wrapper:hover),
.action-form :deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

/* 事件提示 */
.event-hint {
  padding: 20px;
  border-top: 1px solid #e4e7ed;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
}

.hint-content {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

.hint-content p {
  margin: 0 0 12px 0;
  font-weight: 600;
  color: #303133;
}

.hint-content ul {
  margin: 0;
  padding-left: 24px;
}

.hint-content li {
  margin-bottom: 8px;
  position: relative;
}

.hint-content li::before {
  content: '•';
  position: absolute;
  left: -16px;
  color: var(--el-color-primary);
  font-weight: bold;
  font-size: 18px;
}
</style>
