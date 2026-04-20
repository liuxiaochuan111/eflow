/**
 * 类型定义统一导出
 */

export * from './schema'
export * from './config'
export * from './event'

// 表单元数据（后端存储的数据结构）
export interface FormMetadata {
  id: string
  name: string
  schema: import('./schema').SchemaTree
  eventConfig: import('./event').EventConfig
  createdAt: string
  updatedAt: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页参数
export interface PageParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
