import type { ComponentConfig } from '../../types'

const TabItemSetters: ComponentConfig = {
  type: 'TabItem',
  name: 'TabItem',
  nameCn: '标签项',
  props: {
    label: {
      type: 'Input',
      title: '标签名称',
      required: true,
      default: ''
    },
    disabled: {
      type: 'Switch',
      title: '禁用',
      required: false,
      default: false
    },
    display: {
      type: 'Switch',
      title: '显示',
      required: false,
      default: true
    }
  },
  father: ['Tab']
}

export default TabItemSetters
