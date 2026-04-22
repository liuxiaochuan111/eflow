import type { ComponentConfig } from '../../types'

const BlockSetters: ComponentConfig = {
  type: 'Block',
  name: 'Block',
  nameCn: '区块',
  props: {
    title: {
      type: 'Input',
      title: '标题',
      tooltip: '区块标题',
      required: false,
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
  // Block组件内部默认放置一个Row
  defaultChild: {
    type: 'Row',
    label: 'DefaultRow',
    model: 'DefaultRow',
    display: true,
    gutter: 0,
    children: []
  }
}

export default BlockSetters
