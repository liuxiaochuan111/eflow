<template>
  <div class="list-page">
    <aui-card>
      <template #header>
        <div class="card-header">
          <h2>表单片段列表</h2>
          <aui-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增
          </aui-button>
        </div>
      </template>

      <!-- Search -->
      <aui-row :gutter="20" class="search-row">
        <aui-col :span="8">
          <aui-input
            v-model="searchKeyword"
            placeholder="搜索页面URL或标题"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <aui-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </aui-button>
            </template>
          </aui-input>
        </aui-col>
      </aui-row>

      <!-- Table -->
      <aui-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%; margin-top: 20px"
      >
        <aui-table-column prop="id" label="ID" width="80" />
        <aui-table-column prop="url" label="页面URL" min-width="200" />
        <aui-table-column prop="label" label="标题" min-width="200" />
        <aui-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </aui-table-column>
        <aui-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <aui-button size="small" @click="handleEdit(row)">编辑</aui-button>
            <aui-button size="small" type="primary" @click="handlePreview(row)">预览</aui-button>
            <aui-button size="small" type="danger" @click="handleDelete(row)">删除</aui-button>
          </template>
        </aui-table-column>
      </aui-table>

      <!-- Pagination -->
      <aui-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: center"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </aui-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import components from '../components'
import { Plus, Search } from '@element-plus/icons-vue'
import { getFormFragments, deleteFormFragment } from '../api/mock'
import type { FormFragment } from '../types'

const { AuiMessage: ElMessage, AuiMessageBox: ElMessageBox } = components

const router = useRouter()

const loading = ref(false)
const tableData = ref<FormFragment[]>([])
const searchKeyword = ref('')

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// Load data
const loadData = async () => {
  loading.value = true
  try {
    const result = await getFormFragments({
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchKeyword.value
    })
    tableData.value = result.data
    pagination.total = result.total
  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Search
const handleSearch = () => {
  pagination.page = 1
  loadData()
}

// Add
const handleAdd = () => {
  router.push('/editor')
}

// Edit
const handleEdit = (row: FormFragment) => {
  router.push(`/editor/${row.id}`)
}

// Preview
const handlePreview = (row: FormFragment) => {
  router.push(`/preview/${row.url}`)
}

// Delete
const handleDelete = async (row: FormFragment) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除"${row.label}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteFormFragment(row.id!)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }
}

// Pagination
const handlePageChange = (page: number) => {
  pagination.page = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  loadData()
}

// Format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.list-page {
  padding: 20px;
  height: 100%;
  overflow: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.search-row {
  margin-bottom: 20px;
}

:deep(.el-pagination) {
  display: flex;
}
</style>
