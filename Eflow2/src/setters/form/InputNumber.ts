import type { ComponentConfig } from '../../types'

const InputNumberSetters: ComponentConfig = {
  type: 'InputNumber',
  name: 'InputNumber',
  nameCn: '数字输入',
  props: {
    min: {
      type: 'InputNumber',
      title: '最小值',
      required: false,
      default: undefined
    },
    max: {
      type: 'InputNumber',
      title: '最大值',
      required: false,
      default: undefined
    },
    step: {
      type: 'InputNumber',
      title: '步长',
      required: false,
      default: 1
    },
    stepStrictly: {
      type: 'Switch',
      title: '只能用步长',
      required: false,
      default: false
    },
    precision: {
      type: 'InputNumber',
      title: '精度',
      required: false,
      default: undefined
    },
    disabled: {
      type: 'Switch',
      title: '禁用',
      required: false,
      default: false
    },
    controls: {
      type: 'Switch',
      title: '显示控制按钮',
      required: false,
      default: true
    }
  },
  events: {
    change: { label: '值改变', value: 'change' },
    blur: { label: '失去焦点', value: 'blur' },
    focus: { label: '获得焦点', value: 'focus' }
  },
  father: ['Row']
}

export default InputNumberSetters
