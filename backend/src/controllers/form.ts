import { formModel } from '../models/form'
import type { FormMetadata } from '../models/form'

/**
 * 表单控制器
 */

export const formController = {
  // 获取表单列表
  getForms: (req: any, res: any) => {
    try {
      const forms = formModel.getAllForms()
      res.json({
        code: 200,
        message: 'success',
        data: forms
      })
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message,
        data: null
      })
    }
  },

  // 获取表单详情
  getFormById: (req: any, res: any) => {
    try {
      const { id } = req.params
      const form = formModel.getFormById(id)

      if (!form) {
        return res.status(404).json({
          code: 404,
          message: 'Form not found',
          data: null
        })
      }

      res.json({
        code: 200,
        message: 'success',
        data: form
      })
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message,
        data: null
      })
    }
  },

  // 创建表单
  createForm: (req: any, res: any) => {
    try {
      const { name, schema, eventConfig } = req.body

      if (!name) {
        return res.status(400).json({
          code: 400,
          message: 'Form name is required',
          data: null
        })
      }

      const newForm = formModel.createForm({
        name,
        schema: schema || { type: 'Container', component: 'Container', display: true, options: {}, children: [] },
        eventConfig: eventConfig || {}
      })

      res.json({
        code: 200,
        message: 'Form created successfully',
        data: newForm
      })
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message,
        data: null
      })
    }
  },

  // 更新表单
  updateForm: (req: any, res: any) => {
    try {
      const { id } = req.params
      const { name, schema, eventConfig } = req.body

      const updatedForm = formModel.updateForm(id, { name, schema, eventConfig })

      if (!updatedForm) {
        return res.status(404).json({
          code: 404,
          message: 'Form not found',
          data: null
        })
      }

      res.json({
        code: 200,
        message: 'Form updated successfully',
        data: updatedForm
      })
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message,
        data: null
      })
    }
  },

  // 删除表单
  deleteForm: (req: any, res: any) => {
    try {
      const { id } = req.params
      const deleted = formModel.deleteForm(id)

      if (!deleted) {
        return res.status(404).json({
          code: 404,
          message: 'Form not found',
          data: null
        })
      }

      res.json({
        code: 200,
        message: 'Form deleted successfully',
        data: null
      })
    } catch (error: any) {
      res.status(500).json({
        code: 500,
        message: error.message,
        data: null
      })
    }
  }
}
