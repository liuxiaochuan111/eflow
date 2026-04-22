<template>
  <div class="preview-page">
    <aui-card>
      <template #header>
        <div class="preview-header">
          <h2>表单预览</h2>
          <aui-button @click="handleBack">返回</aui-button>
        </div>
      </template>

      <aui-alert
        v-if="error"
        type="error"
        :title="error"
        :closable="false"
        style="margin-bottom: 20px"
      />

      <div v-loading="loading">
        <FormRenderer
          v-if="formData && formData.schema"
          ref="formRendererRef"
          v-model="formModel"
          :schema="formData.schema"
        />

        <aui-empty v-else-if="!loading" description="未找到表单配置" />
      </div>

      <aui-divider />

      <div class="preview-actions">
        <aui-button @click="handleReset">重置</aui-button>
        <aui-button type="primary" @click="handleSubmit">提交</aui-button>
        <aui-button @click="handleShowData">查看数据</aui-button>
      </div>

      <aui-dialog
        v-model="dataDialogVisible"
        title="表单数据"
        width="600px"
      >
        <pre class="data-display">{{ JSON.stringify(formModel, null, 2) }}</pre>
      </aui-dialog>
    </aui-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import components from '../components'
import FormRenderer from '../components/FormRenderer.vue'
import { getFormFragmentByUrl } from '../api/mock'

const { AuiMessage: ElMessage } = components

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const error = ref('')
const formData = ref<any>(null)
const formModel = ref<Record<string, any>>({})
const formRendererRef = ref()
const dataDialogVisible = ref(false)

onMounted(async () => {
  await loadFormData()
})

const loadFormData = async () => {
  loading.value = true
  error.value = ''

  try {
    const url = route.params.url as string
    const fragment = await getFormFragmentByUrl(url)

    if (!fragment) {
      error.value = `未找到URL为 "${url}" 的表单配置`
      return
    }

    formData.value = fragment

    // Initialize form model
    const initModel = (schema: any[]): Record<string, any> => {
      const model: Record<string, any> = {}

      const traverse = (nodes: any[]) => {
        nodes.forEach(node => {
          if (node.model) {
            model[node.model] = node.options?.value || ''
          }
          if (node.children) {
            traverse(node.children)
          }
        })
      }

      traverse(schema)
      return model
    }

    formModel.value = initModel(fragment.schema)
  } catch (err: any) {
    error.value = err.message || '加载表单配置失败'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push('/')
}

const handleReset = () => {
  formModel.value = {}
  ElMessage.success('表单已重置')
}

const handleSubmit = async () => {
  try {
    await formRendererRef.value?.validate()
    ElMessage.success('表单验证通过')
    console.log('Form submitted:', formModel.value)
  } catch (err) {
    ElMessage.error('请检查表单填写是否完整')
  }
}

const handleShowData = () => {
  dataDialogVisible.value = true
}
</script>

<style scoped>
.preview-page {
  padding: 20px;
  height: 100%;
  overflow: auto;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.data-display {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 400px;
  overflow: auto;
}
</style>
