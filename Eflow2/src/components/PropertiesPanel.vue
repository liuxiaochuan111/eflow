<template>
  <div class="properties-panel">
    <!-- FormItem包装情况：显示两部分属性 -->
    <template v-if="isFormItem">
      <!-- 上半部分：FormItem属性 -->
      <div class="properties-section">
        <div class="section-header">
          <span>FormItem属性</span>
          <el-tag size="small" type="info">表单项</el-tag>
        </div>
        <el-form :model="localNode" label-width="100px" size="small">
          <el-form-item label="中文标题" required>
            <el-input v-model="localNode.label" />
          </el-form-item>

          <el-form-item label="英文标题" required>
            <el-input v-model="localNode.labelEn" />
          </el-form-item>

          <el-form-item label="字段名" required>
            <el-input v-model="localNode.model" />
          </el-form-item>

          <el-form-item label="列占比">
            <el-select v-model="localNode.span" style="width: 100%">
              <el-option label="2" :value="2" />
              <el-option label="3" :value="3" />
              <el-option label="4" :value="4" />
              <el-option label="6" :value="6" />
              <el-option label="8" :value="8" />
              <el-option label="12" :value="12" />
              <el-option label="24" :value="24" />
            </el-select>
          </el-form-item>

          <el-form-item label="必填">
            <el-switch v-model="localNode.required" />
          </el-form-item>

          <el-form-item label="显示">
            <el-switch v-model="localNode.display" />
          </el-form-item>
        </el-form>
      </div>

      <!-- 分隔线 -->
      <el-divider />

      <!-- 下半部分：内部组件属性 -->
      <div class="properties-section">
        <div class="section-header">
          <span>组件属性</span>
          <el-tag size="small" type="success">{{ innerComponent?.type || 'Unknown' }}</el-tag>
        </div>

        <div v-if="innerComponent" class="inner-component-props">
          <el-form :model="innerComponent" label-width="100px" size="small">
            <template v-for="(prop, key) in innerComponentDef?.props" :key="key">
              <el-form-item :label="prop.title" :required="prop.required">
                <!-- Input type -->
                <el-input
                  v-if="prop.type === 'Input'"
                  v-model="innerComponent[key]"
                  :placeholder="prop.tooltip"
                />

                <!-- Select type -->
                <el-select
                  v-else-if="prop.type === 'Select'"
                  v-model="innerComponent[key]"
                  :placeholder="prop.tooltip"
                  style="width: 100%"
                >
                  <el-option
                    v-for="option in prop.options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>

                <!-- Switch type -->
                <el-switch
                  v-else-if="prop.type === 'Switch'"
                  v-model="innerComponent[key]"
                />

                <!-- InputNumber type -->
                <el-input-number
                  v-else-if="prop.type === 'InputNumber'"
                  v-model="innerComponent[key]"
                  style="width: 100%"
                />
              </el-form-item>
            </template>
          </el-form>
        </div>

        <el-empty v-else description="未找到内部组件" :image-size="60" />
      </div>

      <!-- 事件配置 -->
      <template v-if="hasEvents">
        <el-divider />
        <div class="properties-section">
          <div class="section-header">
            <span>事件配置</span>
          </div>

          <!-- FormItem事件 -->
          <template v-if="formItemEvents">
            <el-divider content-position="left">FormItem事件</el-divider>
            <template v-for="(event, key) in formItemEvents" :key="`formitem-${key}`">
              <el-form-item :label="event.label">
                <el-input
                  :model-value="formItemHandlers[key]"
                  @input="formItemHandlers[key] = $event"
                  placeholder="输入事件处理代码"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
            </template>
          </template>

          <!-- 内部组件事件 -->
          <template v-if="innerComponentEvents">
            <el-divider content-position="left">组件事件</el-divider>
            <template v-for="(event, key) in innerComponentEvents" :key="`inner-${key}`">
              <el-form-item :label="event.label">
                <el-input
                  :model-value="innerComponentHandlers[key]"
                  @input="innerComponentHandlers[key] = $event"
                  placeholder="输入事件处理代码"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
            </template>
          </template>
        </div>
      </template>
    </template>

    <!-- 普通组件属性 -->
    <template v-else>
      <el-form :model="localNode" label-width="100px" size="small">
        <el-form-item label="组件类型">
          <el-input v-model="localNode.type" disabled />
        </el-form-item>

        <el-form-item label="组件名称" required>
          <el-input v-model="localNode.label" />
        </el-form-item>

        <el-form-item label="数据字段" required>
          <el-input v-model="localNode.model" />
        </el-form-item>

        <el-form-item label="显示">
          <el-switch v-model="localNode.display" />
        </el-form-item>

        <template v-if="componentDef">
          <el-divider>组件属性</el-divider>

          <template v-for="(prop, key) in componentDef.props" :key="key">
            <el-form-item :label="prop.title" :required="prop.required">
              <!-- Input type -->
              <el-input
                v-if="prop.type === 'Input'"
                v-model="localNode[key]"
                :placeholder="prop.tooltip"
              />

              <!-- Select type -->
              <el-select
                v-else-if="prop.type === 'Select'"
                v-model="localNode[key]"
                :placeholder="prop.tooltip"
                style="width: 100%"
              >
                <el-option
                  v-for="option in prop.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>

              <!-- Switch type -->
              <el-switch
                v-else-if="prop.type === 'Switch'"
                v-model="localNode[key]"
              />

              <!-- InputNumber type -->
              <el-input-number
                v-else-if="prop.type === 'InputNumber'"
                v-model="localNode[key]"
                style="width: 100%"
              />
            </el-form-item>
          </template>
        </template>

        <!-- Event Configuration -->
        <template v-if="componentDef && componentDef.events">
          <el-divider>事件配置</el-divider>

          <template v-for="(event, key) in componentDef.events" :key="key">
            <el-form-item :label="event.label">
              <el-input
                :model-value="eventHandlers[key]"
                @input="eventHandlers[key] = $event"
                placeholder="输入事件处理代码"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </template>
        </template>
      </el-form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { SchemaNode, ComponentConfig } from '../types'
import { getComponentSetters } from '../setters'

interface Props {
  modelValue: SchemaNode
  componentDef: ComponentConfig | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: SchemaNode]
}>()

const localNode = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 检查是否是FormItem
const isFormItem = computed(() => {
  return props.modelValue.type === 'FormItem'
})

// 获取内部组件
const innerComponent = computed(() => {
  if (isFormItem.value && props.modelValue.children && props.modelValue.children.length > 0) {
    return props.modelValue.children[0]
  }
  return null
})

// 获取内部组件定义
const innerComponentDef = computed(() => {
  if (innerComponent.value) {
    return getComponentSetters(innerComponent.value.type || innerComponent.value.component || 'Input')
  }
  return null
})

// FormItem事件
const formItemEvents = computed(() => {
  const formItemDef = getComponentSetters('FormItem')
  return formItemDef?.events
})

// 内部组件事件
const innerComponentEvents = computed(() => {
  return innerComponentDef.value?.events
})

// 是否有事件
const hasEvents = computed(() => {
  return !!(formItemEvents.value || innerComponentEvents.value || (props.componentDef?.events))
})

// 普通组件事件处理器
const eventHandlers = computed<Record<string, string>>({
  get: () => (props.modelValue as any).eventHandlers || {},
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      eventHandlers: value
    })
  }
})

// FormItem事件处理器
const formItemHandlers = computed<Record<string, string>>({
  get: () => (props.modelValue as any).formItemHandlers || {},
  set: (value) => {
    emit('update:modelValue', {
      ...props.modelValue,
      formItemHandlers: value
    })
  }
})

// 内部组件事件处理器
const innerComponentHandlers = computed<Record<string, string>>({
  get: () => {
    if (innerComponent.value) {
      return (innerComponent.value as any).eventHandlers || {}
    }
    return {}
  },
  set: (value) => {
    if (innerComponent.value) {
      emit('update:modelValue', {
        ...props.modelValue,
        children: [{
          ...innerComponent.value,
          eventHandlers: value
        }]
      })
    }
  }
})

// Watch for changes and emit updates
watch(localNode, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

// Watch inner component changes
watch(innerComponent, (newVal) => {
  if (newVal && isFormItem.value) {
    emit('update:modelValue', {
      ...props.modelValue,
      children: [newVal]
    })
  }
}, { deep: true })
</script>

<style scoped>
.properties-panel {
  padding: 10px;
  height: 100%;
  overflow: auto;
}

.properties-section {
  margin-bottom: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  color: #303133;
}

.inner-component-props {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.form-item-empty {
  color: #909399;
  font-size: 12px;
  font-style: italic;
}

.el-divider {
  margin: 15px 0;
}
</style>
