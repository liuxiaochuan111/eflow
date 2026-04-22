<template>
  <div class="schema-node-renderer">
    <!-- Block Container -->
    <aui-card v-if="node.type === 'Block'" shadow="default">
      <template #header v-if="node.title">
        <span>{{ node.title }}</span>
      </template>
      <template v-if="node.children && node.children.length > 0">
        <SchemaNodeRenderer
          v-for="child in node.children"
          :key="child.label"
          :node="child"
          :model-value="modelValue"
          @update:model-value="$emit('update:model-value', $event)"
        />
      </template>
    </aui-card>

    <!-- Container -->
    <div v-else-if="node.type === 'Container'" class="container-wrapper">
      <h4 v-if="node.title">{{ node.title }}</h4>
      <template v-if="node.children && node.children.length > 0">
        <SchemaNodeRenderer
          v-for="child in node.children"
          :key="child.label"
          :node="child"
          :model-value="modelValue"
          @update:model-value="$emit('update:model-value', $event)"
        />
      </template>
    </div>

    <!-- Tab -->
    <aui-tabs v-else-if="node.type === 'Tab'" :type="node.type" v-bind="getNodeProps(node)">
      <aui-tab-pane
        v-for="child in node.children"
        :key="child.label"
        :label="child.label"
        :name="child.model"
      >
        <SchemaNodeRenderer
          v-if="child.children && child.children.length > 0"
          v-for="grandchild in child.children"
          :key="grandchild.label"
          :node="grandchild"
          :model-value="modelValue"
          @update:model-value="$emit('update:model-value', $event)"
        />
      </aui-tab-pane>
    </aui-tabs>

    <!-- Row -->
    <aui-row v-else-if="node.type === 'Row'" :gutter="node.gutter" class="row-wrapper">
      <aui-col
        v-for="child in node.children"
        :key="child.label"
        :span="child.span || 12"
      >
        <SchemaNodeRenderer
          :node="child"
          :model-value="modelValue"
          @update:model-value="$emit('update:model-value', $event)"
        />
      </aui-col>
    </aui-row>

    <!-- FormItem -->
    <aui-form-item
      v-else-if="node.type === 'FormItem'"
      :label="node.labelEn || node.label"
      :required="node.required"
      :prop="node.model"
    >
      <component
        v-if="childComponent"
        :is="getComponentByType(childComponent.component || 'Input')"
        v-bind="childComponent.options || {}"
        :model-value="modelValue[childComponent.model]"
        @update:model-value="handleUpdate(childComponent.model, $event)"
        @blur="handleEvent(childComponent, 'blur', $event)"
        @focus="handleEvent(childComponent, 'focus', $event)"
        @change="handleEvent(childComponent, 'change', $event)"
      />
      <span v-else class="form-item-empty">请拖拽表单组件到此处</span>
    </aui-form-item>

    <!-- Direct form components -->
    <aui-form-item
      v-else-if="isFormComponent(node.type)"
      :label="node.label"
      :required="node.required"
      :prop="node.model"
    >
      <component
        :is="getComponentByType(node.type)"
        v-bind="node.options"
        :model-value="modelValue[node.model]"
        @update:model-value="handleUpdate(node.model, $event)"
        @blur="handleEvent(node, 'blur', $event)"
        @focus="handleEvent(node, 'focus', $event)"
        @change="handleEvent(node, 'change', $event)"
      />
    </aui-form-item>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { executeEventHandler } from '../utils/eventExecutor'
import type { SchemaNode } from '../types'

interface Props {
  node: SchemaNode
  modelValue: Record<string, any>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:model-value': [value: Record<string, any>]
}>()

// Get child component for FormItem
const childComponent = computed((): SchemaNode | undefined => {
  return props.node.children?.[0]
})

const getNodeProps = (node: SchemaNode) => {
  const props: Record<string, any> = {}
  if (node.type) props.type = node.type
  if (node.position) props.position = node.position
  return props
}

const getComponentByType = (type: string) => {
  const componentMap: Record<string, string> = {
    Input: 'AuiInput',
    InputNumber: 'AuiInputNumber',
    Select: 'AuiSelect',
    Switch: 'AuiSwitch',
    DatePicker: 'AuiDatePicker',
    TimePicker: 'AuiTimePicker'
  }
  return componentMap[type] || 'AuiInput'
}

const isFormComponent = (type: string) => {
  return ['Input', 'InputNumber', 'Select', 'Switch', 'DatePicker', 'TimePicker'].includes(type)
}

const handleUpdate = (field: string, value: any) => {
  emit('update:model-value', {
    ...props.modelValue,
    [field]: value
  })
}

const handleEvent = (node: SchemaNode | undefined, eventName: string, event: Event) => {
  if (!node || !node.eventHandlers) return

  const handlerCode = node.eventHandlers[eventName]
  if (!handlerCode) return

  try {
    executeEventHandler(handlerCode, {
      component: null,
      formData: props.modelValue,
      event,
      args: []
    })
  } catch (error) {
    console.error(`Event "${eventName}" execution error:`, error)
  }
}

// Lifecycle events
onMounted(() => {
  if (props.node.eventHandlers?.mounted) {
    try {
      executeEventHandler(props.node.eventHandlers.mounted, {
        component: null,
        formData: props.modelValue,
        event: null as any,
        args: []
      })
    } catch (error) {
      console.error('Mounted event error:', error)
    }
  }
})
</script>

<style scoped>
.schema-node-renderer {
  width: 100%;
}

.container-wrapper {
  width: 100%;
  padding: 10px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  margin-bottom: 10px;
}

.row-wrapper {
  width: 100%;
  margin-bottom: 10px;
}
</style>
