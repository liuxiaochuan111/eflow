import type { ComponentConfig } from '../../types'

const InputSetters: ComponentConfig = {
  type: 'Input',
  name: 'Input',
  nameCn: '输入框',
  props: {
    type: {
      type: 'Select',
      title: '输入框类型',
      required: false,
      default: 'text',
      options: [
        { label: '文本', value: 'text' },
        { label: '文本域', value: 'textarea' },
        { label: '密码', value: 'password' },
        { label: '数字', value: 'number' }
      ]
    },
    placeholder: {
      type: 'Input',
      title: '占位文本',
      required: false,
      default: ''
    },
    clearable: {
      type: 'Switch',
      title: '可清空',
      required: false,
      default: false
    },
    disabled: {
      type: 'Switch',
      title: '禁用',
      required: false,
      default: false
    },
    readonly: {
      type: 'Switch',
      title: '只读',
      required: false,
      default: false
    },
    maxlength: {
      type: 'InputNumber',
      title: '最大长度',
      required: false,
      default: undefined
    },
    showWordLimit: {
      type: 'Switch',
      title: '显示字数统计',
      required: false,
      default: false
    }
  },
  events: {
    blur: { label: '失去焦点', value: 'blur' },
    focus: { label: '获得焦点', value: 'focus' },
    change: { label: '值改变', value: 'change' },
    clear: { label: '清空', value: 'clear' }
  },
  father: ['Row']
}

export default InputSetters
