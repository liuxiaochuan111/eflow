<template>
  <div class="list-page">
    <el-card class="header-card">
      <div class="header">
        <h2>表单清单</h2>
        <el-button type="primary" :icon="Plus" @click="handleCreate">新增表单</el-button>
      </div>
    </el-card>

    <el-card class="table-card">
      <el-table :data="forms" v-loading="loading">
        <el-table-column prop="name" label="表单名称" />
        <el-table-column prop="id" label="表单ID" width="300" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="success" link @click="handleUse(row.id)">使用</el-button>
            <el-button type="primary" link @click="handleEdit(row.id)">编辑</el-button>
            <el-popconfirm title="确定删除该表单吗？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getForms, deleteForm } from '@/api/form'
import type { FormMetadata } from '@/types'

const router = useRouter()
const forms = ref<FormMetadata[]>([])
const loading = ref(false)

const loadForms = async () => {
  loading.value = true
  try {
    const res = await getForms()
    if (res.code === 200) {
      forms.value = res.data
    }
  } catch (error) {
    ElMessage.error('加载表单列表失败')
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  router.push('/builder')
}

const handleEdit = (id: string) => {
  router.push(`/builder/${id}`)
}

const handleUse = (id: string) => {
  router.push(`/use/${id}`)
}

const handleDelete = async (id: string) => {
  try {
    const res = await deleteForm(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadForms()
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  loadForms()
})
</script>

<style scoped>
.list-page {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
}
</style>
