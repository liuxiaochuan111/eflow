<template>
  <aui-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    labaui-width="120px"
    class="form-renderer"
  >
    <template v-for="node in schema" :key="node.label">
      <SchemaNodeRenderer
        :node="node"
        :model-value="formData"
        @update:model-value="(val) => formData = val"
      />
    </template>
  </aui-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import SchemaNodeRenderer from './SchemaNodeRenderer.vue'
import type { SchemaNode } from '../types'

interface Props {
  schema: SchemaNode[]
  modelValue?: Record<string, any>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const formRef = ref<FormInstance>()
const formData = computed<Record<string, any>>({
  get: () => props.modelValue || {},
  set: (value) => emit('update:modelValue', value)
})

// Form validation rules
const formRules = computed(() => {
  const rules: Record<string, any> = {}

  const collectRules = (nodes: SchemaNode[]) => {
    nodes.forEach(node => {
      if (node.required && node.model) {
        rules[node.model] = [
          {
            required: true,
            message: `${node.label || node.model}是必填项`,
            trigger: 'blur'
          }
        ]
      }
      if (node.children) {
        collectRules(node.children)
      }
    })
  }

  collectRules(props.schema)
  return rules
})


// Expose form methods
defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: () => formRef.value?.clearValidate()
})
</script>

<style scoped>
.form-renderer {
  padding: 20px;
}
</style>
