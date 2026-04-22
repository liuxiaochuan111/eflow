<template>
  <div class="schema-renderer">
    <div
      v-for="node in schema"
      :key="node.label"
      class="schema-node"
      :class="{ selected: node === selectedNode }"
      @click.stop="handleSelect(node)"
    >
      <div class="node-header">
        <el-icon>
          <component :is="getNodeIcon(node.type)" />
        </el-icon>
        <span class="node-label">{{ getNodeLabel(node) }}</span>
        <aui-button
          size="small"
          type="danger"
          :icon="Delete"
          circle
          @click.stop="handleDelete(node)"
        />
      </div>

      <div v-if="node.children && node.children.length > 0" class="node-children">
        <SchemaRenderer
          :schema="node.children"
          :selected-node="selectedNode"
          @select="$emit('select', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Delete, FolderOpened, Grid, Document, Tickets, Edit } from '@element-plus/icons-vue'
import type { SchemaNode } from '../types'

interface Props {
  schema: SchemaNode[]
  selectedNode: SchemaNode | null
}

defineProps<Props>()

defineEmits<{
  select: [node: SchemaNode]
  delete: [node: SchemaNode]
}>()

const getNodeIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    Block: FolderOpened,
    Container: Grid,
    Tab: Tickets,
    TabItem: Document,
    Row: Edit,
    Input: Edit,
    Select: Edit
  }
  return iconMap[type] || Edit
}

const getNodeLabel = (node: SchemaNode) => {
  return node.title || node.label || node.type
}

const handleSelect = (_node: SchemaNode) => {
  // Handle in parent
}

const handleDelete = (_node: SchemaNode) => {
  // Handle in parent
}
</script>

<style scoped>
.schema-renderer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.schema-node {
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  background: white;
  transition: all 0.3s;
  cursor: pointer;
}

.schema-node:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.schema-node.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.node-header .el-icon {
  color: #409eff;
  font-size: 18px;
}

.node-label {
  flex: 1;
  font-weight: 500;
  color: #303133;
}

.node-children {
  margin-top: 10px;
  padding-left: 20px;
  border-left: 2px dashed #e0e0e0;
}
</style>
