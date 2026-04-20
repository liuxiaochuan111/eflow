<template>
  <div
    class="form-builder"
    @dragover.prevent="handleRootDragOver"
    @drop.prevent="handleRootDrop"
  >
    <component
      :is="getComponentByType(schema.component)"
      v-bind="schema.options"
      :schema="schema"
      :is-build="isBuild"
      :form-data="formData"
      :event-config="eventConfig"
      :custom-funcs="customFuncs"
      :state="State"
      :skip-models="skipModels"
      :comp-config="compConfig"
      @update:model-value="handleUpdate"
      @render-end="handleRenderEnd"
      @node-click="handleNodeClick"
      @drag-over="handleDragOver"
      @drag-leave="handleDragLeave"
      @drop="handleDrop"
      @node-delete="handleNodeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, provide } from 'vue'
import type { SchemaTree, FormData, EventConfig, SchemaNode } from '@/types'
import { buildFormData, generateId } from '@/utils'
import { useEventBinding } from '@/composables/useEventBinding'

// Props
interface Props {
  pageUrl?: string
  configData?: Record<string, any>
  compConfig?: Record<string, string>
  isBuild?: boolean
  customFuncs?: Record<string, Function>
  State?: Record<string, any>
  skipModels?: string[]
  modelValue?: Record<string, any>
  schema?: SchemaTree
  eventConfig?: EventConfig
}

const props = withDefaults(defineProps<Props>(), {
  isBuild: false,
  skipModels: () => [],
  modelValue: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  'update:schema': [schema: SchemaTree]
  renderEnd: []
  change: [field: string, value: any]
  'node-click': [node: SchemaNode]
}>()

// Refs
const formData = ref<FormData>(props.modelValue || {})
const localSchema = ref<SchemaTree | null>(props.schema || null)
const selectedNode = ref<SchemaNode | null>(null)
const draggingNode = ref<SchemaNode | null>(null)
const hoveredNodeId = ref<string | null>(null)
const dragTarget = ref<{ nodeId: string | null; index: number } | null>(null)

// Event binding
const { executeEvent } = useEventBinding(props.eventConfig)

// Computed
const schema = computed(() => {
  if (localSchema.value) {
    return localSchema.value
  }
  return {
    id: 'root_container',
    type: 'Container' as const,
    component: 'Container' as const,
    display: true,
    options: {},
    children: []
  }
})

// Provide drag state to children
provide('dragState', {
  draggingNode,
  hoveredNodeId,
  dragTarget,
  selectedNode
})

// Methods
const getComponentByType = (component: string) => {
  const compMap = {
    Container: 'ContainerContainer',
    Form: 'FormContainer',
    Row: 'RowContainer',
    Block: 'BlockContainer'
  }
  return compMap[component as keyof typeof compMap] || component
}

const handleUpdate = (field: string, value: any, eventName?: string) => {
  formData.value[field] = value
  emit('update:modelValue', formData.value)
  emit('change', field, value)

  // 执行事件联动
  if (eventName) {
    executeEvent(field, eventName, {
      formData: formData.value,
      State: props.State,
      customFuncs: props.customFuncs,
      currentModel: field,
      currentEvent: eventName
    })
  }
}

const handleRenderEnd = () => {
  emit('renderEnd')
}

const handleNodeClick = (node: SchemaNode) => {
  selectedNode.value = node
  emit('node-click', node)
}

// 拖拽处理
const handleDragOver = (nodeId: string, index: number = -1) => {
  if (!draggingNode.value) return
  hoveredNodeId.value = nodeId
  dragTarget.value = { nodeId, index }
}

const handleDragLeave = () => {
  hoveredNodeId.value = null
}

const handleDrop = (targetNodeId: string | null, index: number = -1) => {
  console.log('handleDrop called:', { targetNodeId, index, draggingNode: draggingNode.value })

  if (!draggingNode.value) return false

  const newNode = { ...draggingNode.value }
  newNode.id = generateId(newNode.component.toLowerCase())

  console.log('Adding node:', newNode)

  if (targetNodeId === null) {
    // 添加到根节点
    if (!localSchema.value!.children) {
      localSchema.value!.children = []
    }
    localSchema.value!.children.push(newNode)
    console.log('Added to root, new children:', localSchema.value!.children)
  } else {
    // 添加到指定容器
    const targetNode = findNodeById(localSchema.value!, targetNodeId)
    if (targetNode) {
      if (!targetNode.children) {
        targetNode.children = []
      }
      if (index >= 0 && index < targetNode.children.length) {
        targetNode.children.splice(index, 0, newNode)
      } else {
        targetNode.children.push(newNode)
      }
      console.log('Added to container:', targetNodeId, 'new children:', targetNode.children)
    } else {
      console.error('Target node not found:', targetNodeId)
      return false
    }
  }

  // 触发更新
  emit('update:schema', JSON.parse(JSON.stringify(localSchema.value)))

  // 清除拖拽状态
  draggingNode.value = null
  hoveredNodeId.value = null
  dragTarget.value = null

  return true
}

// 根容器拖拽处理
const handleRootDragOver = () => {
  if (!draggingNode.value) return
  const rootId = (localSchema.value as any)?.id || 'root'
  hoveredNodeId.value = rootId
  dragTarget.value = { nodeId: rootId, index: -1 }
}

const handleRootDrop = () => {
  const rootId = (localSchema.value as any)?.id || 'root'
  return handleDrop(rootId, -1)
}

const handleNodeDelete = (nodeId: string) => {
  const result = deleteNodeById(localSchema.value!, nodeId)
  if (result) {
    emit('update:schema', JSON.parse(JSON.stringify(localSchema.value)))
    if (selectedNode.value?.id === nodeId) {
      selectedNode.value = null
    }
  }
}

// 递归查找节点
const findNodeById = (node: any, id: string): any => {
  if (node.id === id) return node
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id)
      if (found) return found
    }
  }
  return null
}

// 递归删除节点
const deleteNodeById = (node: any, id: string): boolean => {
  if (node.children) {
    const index = node.children.findIndex((child: any) => child.id === id)
    if (index > -1) {
      node.children.splice(index, 1)
      return true
    }
    for (const child of node.children) {
      if (deleteNodeById(child, id)) return true
    }
  }
  return false
}

// 暴露方法
const validate = async (): Promise<boolean> => {
  // TODO: 实现表单校验
  return true
}

const clearValidate = () => {
  // TODO: 实现清除校验
}

const setSchemaByConfig = (_config: Record<string, any>, _prop: string) => {
  // TODO: 实现批量设置属性
}

const getFormData = () => {
  return formData.value
}

// 设置拖拽节点（从外部调用）
const setDraggingNode = (node: SchemaNode | null) => {
  draggingNode.value = node
}

defineExpose({
  validate,
  clearValidate,
  setSchemaByConfig,
  getFormData,
  setDraggingNode,
  selectedNode
})

// Watch
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal }
    }
  },
  { deep: true }
)

watch(
  () => props.schema,
  (newVal) => {
    if (newVal) {
      localSchema.value = newVal
      formData.value = buildFormData(newVal)
    }
  },
  { immediate: true }
)

// Lifecycle
onMounted(async () => {
  if (props.pageUrl) {
    // TODO: 从服务端加载 schema
  }
})
</script>

<style scoped>
.form-builder {
  width: 100%;
  height: 100%;
}
</style>
