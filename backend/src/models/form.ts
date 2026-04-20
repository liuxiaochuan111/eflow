import { v4 as uuidv4 } from 'uuid'

/**
 * 表单数据模型
 */

export interface FormMetadata {
  id: string
  name: string
  schema: any
  eventConfig: any
  createdAt: string
  updatedAt: string
}

export class FormModel {
  private forms: Map<string, FormMetadata> = new Map()

  // 获取所有表单
  getAllForms(): FormMetadata[] {
    return Array.from(this.forms.values())
  }

  // 根据 ID 获取表单
  getFormById(id: string): FormMetadata | undefined {
    return this.forms.get(id)
  }

  // 创建表单
  createForm(data: Omit<FormMetadata, 'id' | 'createdAt' | 'updatedAt'>): FormMetadata {
    const now = new Date().toISOString()
    const form: FormMetadata = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now
    }
    this.forms.set(form.id, form)
    return form
  }

  // 更新表单
  updateForm(id: string, data: Partial<Omit<FormMetadata, 'id' | 'createdAt' | 'updatedAt'>>): FormMetadata | null {
    const form = this.forms.get(id)
    if (!form) return null

    const updatedForm: FormMetadata = {
      ...form,
      ...data,
      id: form.id,
      createdAt: form.createdAt,
      updatedAt: new Date().toISOString()
    }
    this.forms.set(id, updatedForm)
    return updatedForm
  }

  // 删除表单
  deleteForm(id: string): boolean {
    return this.forms.delete(id)
  }

  // 检查表单是否存在
  exists(id: string): boolean {
    return this.forms.has(id)
  }
}

// 单例实例
export const formModel = new FormModel()
