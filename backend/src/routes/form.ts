import express from 'express'
import { formController } from '../controllers/form'

const router = express.Router()

// 获取表单列表
router.get('/', formController.getForms)

// 获取表单详情
router.get('/:id', formController.getFormById)

// 创建表单
router.post('/', formController.createForm)

// 更新表单
router.put('/:id', formController.updateForm)

// 删除表单
router.delete('/:id', formController.deleteForm)

export default router
