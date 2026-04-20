<template>
  <div class="props-config-panel">
    <div v-if="!selectedNode" class="empty-state">
      <div class="empty-illustration">
        <el-icon class="empty-icon"><Setting /></el-icon>
      </div>
      <p class="empty-text">请选择一个组件</p>
      <p class="empty-hint">点击画布中的组件进行配置</p>
    </div>

    <div v-else class="config-content">
      <!-- 组件信息头部 -->
      <div class="component-header">
        <div class="component-badge">
          <div class="badge-icon" :style="{ background: getComponentGradient(selectedNode.component) }">
            <el-icon :size="20">
              <component :is="getIcon(selectedNode.component)" />
            </el-icon>
          </div>
          <div class="badge-info">
            <h3 class="component-name">{{ selectedNode.component }}</h3>
            <p class="component-type">{{ getFormItemConfig(selectedNode.component)?.labelEn }}</p>
          </div>
        </div>
        <div class="component-meta">
          <el-tag size="small" type="primary" effect="plain">
            {{ selectedNode.type === 'FormItem' ? '表单项' : '容器' }}
          </el-tag>
          <el-tag size="small" type="success" effect="plain">
            {{ Object.keys(componentProps).length }} 属性
          </el-tag>
        </div>
      </div>

      <!-- 属性分类标签页 -->
      <el-tabs v-model="activeTab" class="props-tabs">
        <!-- 基础属性 -->
        <el-tab-pane name="basic">
          <template #label>
            <span class="tab-label">
              <el-icon><InfoFilled /></el-icon>
              <span>基础属性</span>
              <el-badge
                v-if="getBasicPropsCount() > 0"
                :value="getBasicPropsCount()"
                type="primary"
              />
            </span>
          </template>
          <div class="props-section">
            <div class="section-title">
              <el-icon><Key /></el-icon>
              <span>核心配置</span>
            </div>
            <div class="props-form">
              <template v-for="(propConfig, propName) in componentProps" :key="propName">
                <template v-if="['label', 'model', 'span', 'required'].includes(propName)">
                  <div class="form-item special-prop" v-if="selectedNode.type === 'FormItem' || isSpecialProp(propName)">
                    <div class="form-label">
                      <label>{{ getPropLabel(propName, propConfig) }}</label>
                      <el-tag v-if="propConfig.required" size="small" type="danger" effect="plain">必填</el-tag>
                    </div>
                    <div class="form-control">
                      <component
                        :is="getPropComponent(propConfig)"
                        v-model="(selectedNode as any)[propName]"
                        v-bind="getPropBindProps(propConfig)"
                        @change="handlePropChange(propName, $event)"
                      />
                    </div>
                    <div v-if="propConfig.description" class="form-hint">
                      <el-icon><QuestionFilled /></el-icon>
                      <span>{{ propConfig.description }}</span>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </el-tab-pane>

        <!-- 显示属性 -->
        <el-tab-pane name="display">
          <template #label>
            <span class="tab-label">
              <el-icon><View /></el-icon>
              <span>显示属性</span>
              <el-badge :value="2" type="success" />
            </span>
          </template>
          <div class="props-section">
            <div class="section-title">
              <el-icon><MagicStick /></el-icon>
              <span>外观设置</span>
            </div>
            <div class="props-form">
              <div class="form-item">
                <div class="form-label">
                  <label>显示状态</label>
                </div>
                <div class="form-control">
                  <el-switch
                    v-model="selectedNode.display"
                    active-text="显示"
                    inactive-text="隐藏"
                    @change="handlePropChange('display', $event)"
                  />
                </div>
              </div>

            <template v-if="selectedNode.type === 'FormItem'">
              <div class="form-item">
                <label>是否必填</label>
                <el-switch
                  v-model="(selectedNode as any).required"
                  @change="handlePropChange('required', $event)"
                />
              </div>
              <div class="form-item">
                <label>栅格占位</label>
                <el-slider
                  v-model="(selectedNode as any).span"
                  :min="0"
                  :max="24"
                  :marks="{ 0: '0', 12: '1/2', 24: '1' }"
                  @change="handlePropChange('span', $event)"
                />
              </div>
            </template>
          </div>
        </el-tab-pane>

        <!-- 组件属性 -->
        <el-tab-pane name="component">
          <template #label>
            <span>组件属性</span>
            <el-badge :value="Object.keys(componentProps).length" type="primary" />
          </template>
          <div class="props-form">
            <template v-for="(propConfig, propName) in componentProps" :key="propName">
              <!-- 跳过特殊属性 -->
              <template v-if="!['label', 'model', 'span', 'required'].includes(propName)">
                <div class="form-item">
                  <label>{{ propConfig.label || propName }}</label>
                  <component
                    :is="getPropComponent(propConfig)"
                    v-model="selectedNode.options[propName]"
                    v-bind="getPropBindProps(propConfig)"
                    @change="handlePropChange(propName, $event, true)"
                  />
                  <span class="prop-hint">{{ propConfig.type || 'String' }}</span>
                </div>
              </template>
            </template>
          </div>
        </el-tab-pane>

        <!-- 样式属性 -->
        <el-tab-pane label="样式属性" name="style">
          <div class="props-form">
            <div class="form-item">
              <label>自定义类名</label>
              <el-input
                v-model="selectedNode.options.className"
                placeholder="class名称"
                @change="handlePropChange('className', $event, true)"
              />
            </div>
            <div class="form-item">
              <label>内联样式</label>
              <el-input
                v-model="selectedNode.options.style"
                type="textarea"
                :rows="4"
                placeholder="例如：padding: 20px; background: #f5f5f5"
                @change="handlePropChange('style', $event, true)"
              />
            </div>
            <div class="form-item">
              <label>宽度</label>
              <el-input
                v-model="selectedNode.options.width"
                placeholder="例如：100% 或 200px"
                @change="handlePropChange('width', $event, true)"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <el-button type="primary" :icon="Check" @click="applyChanges">应用更改</el-button>
        <el-button :icon="RefreshLeft" @click="resetProps">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ElTabs,
  ElTabPane,
  ElBadge,
  ElButton,
  ElSwitch,
  ElSlider,
  ElInput,
  ElSelect,
  ElInputNumber,
  ElIcon,
  ElMessage
} from 'element-plus'
import { Check, RefreshLeft } from '@element-plus/icons-vue'
import type { SchemaNode } from '@/types'
import { getFormItemConfig } from '@/configs'

interface Props {
  selectedNode: SchemaNode | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selectedNode': [node: SchemaNode | null]
  'propChange': [propName: string, value: any]
}>()

const activeTab = ref('basic')

// 获取组件配置
const componentConfig = computed(() => {
  if (!props.selectedNode) return null
  return getFormItemConfig(props.selectedNode.component)
})

// 获取组件属性配置
const componentProps = computed(() => {
  return componentConfig.value?.props || {}
})

// 获取图标
const getIcon = (component: string) => {
  const icons: Record<string, any> = {
    Input: 'EditPen',
    InputNumber: 'Histogram',
    Select: 'ArrowDown',
    DatePicker: 'Calendar',
    TimePicker: 'Clock',
    Radio: 'CircleCheck',
    Checkbox: 'Select',
    Switch: 'Open',
    Slider: 'Minus',
    Upload: 'Upload',
    Cascader: 'Operation',
    Rate: 'Star',
    ColorPicker: 'Brush',
    Transfer: 'Switch',
    TreeSelect: 'Guide',
    Textarea: 'Document'
  }
  return icons[component] || 'QuestionFilled'
}

// 获取组件渐变色
const getComponentGradient = (component: string) => {
  const gradients: Record<string, string> = {
    Input: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    InputNumber: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    Select: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    DatePicker: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    TimePicker: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    Radio: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    Checkbox: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    Switch: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    Slider: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    Upload: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    Cascader: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    Rate: 'linear-gradient(135deg, #f7ba2a 0%, #f7797d 100%)',
    ColorPicker: 'linear-gradient(135deg, #cd9cf2 0%, #f6f3ff 100%)',
    Transfer: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    TreeSelect: 'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
    Textarea: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)'
  }
  return gradients[component] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
}

// 判断是否是特殊属性
const isSpecialProp = (propName: string) => {
  return ['display', 'required', 'span'].includes(propName)
}

// 获取基础属性数量
const getBasicPropsCount = () => {
  if (!props.selectedNode?.options) return 0
  return Object.keys(props.selectedNode.options).length
}

// 获取属性标签
const getPropLabel = (propName: string, propConfig: any) => {
  const labels: Record<string, string> = {
    label: '标签文本',
    model: '字段名',
    span: '栅格占位',
    required: '是否必填'
  }
  return labels[propName] || propConfig.label || propName
}

// 获取属性渲染组件
const getPropComponent = (propConfig: any) => {
  const componentMap: Record<string, any> = {
    Input: ElInput,
    Switch: ElSwitch,
    Select: ElSelect,
    InputNumber: ElInputNumber
  }
  return componentMap[propConfig.component] || ElInput
}

// 获取属性绑定参数
const getPropBindProps = (propConfig: any) => {
  const bindProps: Record<string, any> = {}

  if (propConfig.component === 'Select') {
    bindProps.options = propConfig.options || []
  }

  if (propConfig.component === 'InputNumber') {
    if (propConfig.min !== undefined) bindProps.min = propConfig.min
    if (propConfig.max !== undefined) bindProps.max = propConfig.max
    if (propConfig.step !== undefined) bindProps.step = propConfig.step
  }

  if (propConfig.component === 'Input' && propConfig.type === 'textarea') {
    bindProps.type = 'textarea'
    bindProps.rows = 3
  }

  return bindProps
}

// 处理属性变更
const handlePropChange = (propName: string, value: any, isOption = false) => {
  if (!props.selectedNode) return

  if (isOption) {
    // 修改 options 属性
    if (!props.selectedNode.options) {
      props.selectedNode.options = {}
    }
    props.selectedNode.options[propName] = value
  } else {
    // 修改节点直接属性
    ;(props.selectedNode as any)[propName] = value
  }

  emit('propChange', propName, value)
}

// 应用更改
const applyChanges = () => {
  emit('update:selectedNode', props.selectedNode)
  ElMessage.success('属性已更新')
}

// 重置属性
const resetProps = () => {
  if (!props.selectedNode) return

  // 重置为默认配置
  const defaultConfig = getFormItemConfig(props.selectedNode.component)
  if (defaultConfig?.defaultOptions) {
    props.selectedNode.options = { ...defaultConfig.defaultOptions }
    emit('update:selectedNode', props.selectedNode)
    ElMessage.info('属性已重置')
  }
}
</script>

<style scoped>
.props-config-panel {
  height: 100%;
  overflow-y: auto;
}

.config-content {
  padding: 20px;
}

.component-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.info-text h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.info-text p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.props-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.form-item :deep(.el-input),
.form-item :deep(.el-select),
.form-item :deep(.el-input-number) {
  width: 100%;
}

.prop-hint {
  font-size: 12px;
  color: #909399;
}

.special-prop {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  border-left: 3px solid #409eff;
}

.special-prop label {
  font-weight: 600;
  color: #303133;
}

.quick-actions {
  display: flex;
  gap: 8px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-top: 16px;
}

.quick-actions .el-button {
  flex: 1;
}

:deep(.el-tabs--border-card) {
  border: 1px solid #e4e7ed;
  box-shadow: none;
}

:deep(.el-tabs__header) {
  background: #f5f7fa;
}

:deep(.el-tab-pane) {
  padding: 16px;
}
</style>
