/**
 * 表单 API
 */

import axios from 'axios'
import type { FormMetadata, ApiResponse } from '@/types'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 获取表单列表
export function getForms(): Promise<ApiResponse<FormMetadata[]>> {
  return api.get('/forms')
}

// 获取表单详情
export function getFormById(id: string): Promise<ApiResponse<FormMetadata>> {
  return api.get(`/forms/${id}`)
}

// 创建表单
export function createForm(data: {
  name: string
  schema?: any
  eventConfig?: any
}): Promise<ApiResponse<FormMetadata>> {
  return api.post('/forms', data)
}

// 更新表单
export function updateForm(
  id: string,
  data: {
    name?: string
    schema?: any
    eventConfig?: any
  }
): Promise<ApiResponse<FormMetadata>> {
  return api.put(`/forms/${id}`, data)
}

// 删除表单
export function deleteForm(id: string): Promise<ApiResponse<null>> {
  return api.delete(`/forms/${id}`)
}
