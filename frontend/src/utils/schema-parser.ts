/**
 * Schema 解析器
 */

import type { SchemaTree, FormData, SchemaNode } from '@/types'

/**
 * 从 Schema 构建 FormData
 */
export function buildFormData(schema: SchemaTree): FormData {
  const formData: FormData = {}

  const traverse = (node: SchemaNode) => {
    if (node.type === 'FormItem') {
      const formItem = node as any
      if (formItem.model) {
        formData[formItem.model] = formData[formItem.model] || ''
      }
    }

    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  traverse(schema)
  return formData
}

/**
 * 验证 Schema 结构
 */
export function validateSchema(schema: any): boolean {
  if (!schema || typeof schema !== 'object') {
    return false
  }

  if (schema.type !== 'Container') {
    return false
  }

  if (!Array.isArray(schema.children)) {
    return false
  }

  return true
}

/**
 * 深度克隆 Schema
 */
export function cloneSchema(schema: SchemaTree): SchemaTree {
  return JSON.parse(JSON.stringify(schema))
}

/**
 * 获取 Schema 中所有表单项的 model
 */
export function getAllModels(schema: SchemaTree): string[] {
  const models: string[] = []

  const traverse = (node: SchemaNode) => {
    if (node.type === 'FormItem') {
      const formItem = node as any
      if (formItem.model && !models.includes(formItem.model)) {
        models.push(formItem.model)
      }
    }

    if (node.children) {
      node.children.forEach(traverse)
    }
  }

  traverse(schema)
  return models
}
