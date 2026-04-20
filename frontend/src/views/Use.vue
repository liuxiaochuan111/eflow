<template>
  <div class="use-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">表单使用场景</h1>
        <p class="page-description">这是表单在实际使用场景中的展示效果</p>
      </div>
      <div class="header-actions">
        <el-button :icon="ArrowLeft" @click="goBack">返回</el-button>
        <el-button :icon="Edit" @click="goToEdit">编辑</el-button>
        <el-button :icon="View" @click="showJson = true">查看数据</el-button>
      </div>
    </div>

    <div class="form-container">
      <el-card v-loading="loading" class="form-card">
        <template #header>
          <div class="card-header">
            <span class="form-title">{{ formInfo.name }}</span>
            <el-tag type="info">{{ formInfo.id }}</el-tag>
          </div>
        </template>

        <FormBuilder
          v-if="currentSchema"
          v-model="formData"
          :schema="currentSchema"
          :event-config="eventConfig"
          :is-build="false"
          @render-end="handleRenderEnd"
        />

        <div v-if="currentSchema" class="form-actions">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </el-card>
    </div>

    <!-- 实时数据显示面板 -->
    <el-drawer v-model="showJson" title="实时数据" size="50%">
      <div class="json-content">
        <el-tabs v-model="activeJsonTab">
          <el-tab-pane label="表单数据" name="data">
            <pre class="json-pre">{{ JSON.stringify(formData, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="Schema" name="schema">
            <pre class="json-pre">{{ JSON.stringify(currentSchema, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="事件配置" name="events">
            <pre class="json-pre">{{ JSON.stringify(eventConfig, null, 2) }}</pre>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit, View } from '@element-plus/icons-vue'
import FormBuilder from '@/components/builder/FormBuilder.vue'
import { getFormById } from '@/api/form'
import type { SchemaTree, EventConfig } from '@/types'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const showJson = ref(false)
const activeJsonTab = ref('data')
const formInfo = ref({
  id: '',
  name: '未命名表单'
})

const currentSchema = ref<SchemaTree | null>(null)
const eventConfig = ref<EventConfig>({})
const formData = ref<Record<string, any>>({})

// 加载表单
const loadForm = async (id: string) => {
  loading.value = true
  try {
    const res = await getFormById(id)
    if (res.code === 200) {
      formInfo.value = {
        id: res.data.id,
        name: res.data.name
      }
      currentSchema.value = res.data.schema
      eventConfig.value = res.data.eventConfig
    }
  } catch (error) {
    ElMessage.error('加载表单失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = () => {
  ElMessage.success('表单提交成功！')
  console.log('表单数据:', formData.value)
  console.log('事件配置:', eventConfig.value)
}

// 重置表单
const handleReset = () => {
  formData.value = {}
  ElMessage.info('表单已重置')
}

// 返回列表
const goBack = () => {
  router.push('/list')
}

// 前往编辑
const goToEdit = () => {
  router.push(`/builder/${formInfo.value.id}`)
}

// 渲染完成
const handleRenderEnd = () => {
  console.log('表单渲染完成')
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    loadForm(id)
  } else {
    ElMessage.error('缺少表单ID')
    goBack()
  }
})
</script>

<style scoped>
.use-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  flex: 1;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 500;
  color: #303133;
}

.page-description {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
}

.form-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.form-actions {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.json-content {
  padding: 16px;
}

.json-pre {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  overflow: auto;
  max-height: calc(100vh - 200px);
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
}
</style>
