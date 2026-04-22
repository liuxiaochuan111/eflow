import type { ComponentConfig } from '../../types'

const TabSetters: ComponentConfig = {
  type: 'Tab',
  name: 'Tab',
  nameCn: '标签页',
  props: {
    type: {
      type: 'Select',
      title: '标签类型',
      required: false,
      default: '',
      options: [
        { label: '卡片类型', value: 'card' },
        { label: '边框类型', value: 'border-card' }
      ]
    },
    position: {
      type: 'Select',
      title: '标签位置',
      required: false,
      default: 'top',
      options: [
        { label: '顶部', value: 'top' },
        { label: '右侧', value: 'right' },
        { label: '底部', value: 'bottom' },
        { label: '左侧', value: 'left' }
      ]
    },
    display: {
      type: 'Switch',
      title: '显示',
      required: false,
      default: true
    }
  }
}

export default TabSetters
