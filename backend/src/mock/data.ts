/**
 * Mock 数据初始化
 */

import { formModel } from '../models/form'

/**
 * 初始化示例数据
 */
export function initMockData() {
  // 如果没有任何表单，创建一个示例表单
  if (formModel.getAllForms().length === 0) {
    const sampleForm = formModel.createForm({
      name: '示例用户注册表单',
      schema: {
        id: 'root',
        type: 'Container',
        component: 'Container',
        display: true,
        options: {},
        children: [
          {
            id: 'form_1',
            type: 'Container',
            component: 'Form',
            display: true,
            options: {
              labelPosition: 'top',
              labelWidth: '100',
              size: 'default'
            },
            children: [
              {
                id: 'row_1',
                type: 'Container',
                component: 'Row',
                display: true,
                options: {
                  gutter: 20
                },
                children: [
                  {
                    id: 'input_username',
                    type: 'FormItem',
                    component: 'Input',
                    model: 'username',
                    label: '用户名',
                    display: true,
                    required: true,
                    options: {
                      placeholder: '请输入用户名',
                      clearable: true,
                      maxlength: 20
                    }
                  },
                  {
                    id: 'input_email',
                    type: 'FormItem',
                    component: 'Input',
                    model: 'email',
                    label: '邮箱',
                    display: true,
                    required: true,
                    options: {
                      placeholder: '请输入邮箱',
                      clearable: true,
                      type: 'email'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      eventConfig: {}
    })

    console.log(`✅ Sample form created: ${sampleForm.name} (ID: ${sampleForm.id})`)
  }
}
