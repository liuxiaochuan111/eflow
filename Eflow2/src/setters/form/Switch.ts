import type { ComponentConfig } from '../../types'

const SwitchSetters: ComponentConfig = {
  type: 'Switch',
  name: 'Switch',
  nameCn: '开关',
  props: {
    disabled: {
      type: 'Switch',
      title: '禁用',
      required: false,
      default: false
    },
    loading: {
      type: 'Switch',
      title: '加载中',
      required: false,
      default: false
    },
    size: {
      type: 'Select',
      title: '尺寸',
      required: false,
      default: 'default',
      options: [
        { label: '大', value: 'large' },
        { label: '默认', value: 'default' },
        { label: '小', value: 'small' }
      ]
    },
    activeText: {
      type: 'Input',
      title: '打开时文字',
      required: false,
      default: ''
    },
    inactiveText: {
      type: 'Input',
      title: '关闭时文字',
      required: false,
      default: ''
    }
  },
  events: {
    change: { label: '值改变', value: 'change' }
  },
  father: ['Row']
}

export default SwitchSetters
