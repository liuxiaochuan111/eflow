import type { ComponentConfig } from '../../types'

const FormItemSetters: ComponentConfig = {
  type: 'FormItem',
  name: 'FormItem',
  nameCn: '表单项',
  props: {
    span: {
      type: 'Select',
      title: '列占比',
      tooltip: '在Row容器中的列宽度',
      required: false,
      default: 12,
      options: [
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '6', value: 6 },
        { label: '8', value: 8 },
        { label: '12', value: 12 }
      ]
    },
    label: {
      type: 'Input',
      title: '中文名称',
      required: true,
      default: '',
      controlShow: true
    },
    labelEn: {
      type: 'Input',
      title: '英文名称',
      required: true,
      default: '',
      controlShow: true
    },
    required: {
      type: 'Switch',
      title: '必填',
      required: false,
      default: false,
      controlShow: true
    },
    display: {
      type: 'Switch',
      title: '显示',
      required: false,
      default: true
    },
    labelTips: {
      type: 'Input',
      title: '提示信息',
      required: false,
      default: '',
      controlShow: false
    }
  },
  events: {
    validate: { label: 'validate', value: 'validate' }
  },
  methods: {
    resetField: { label: 'resetField', value: 'resetField' },
    clearValidate: { label: 'clearValidate', value: 'clearValidate' }
  },
  father: ['Row']
}

export default FormItemSetters
