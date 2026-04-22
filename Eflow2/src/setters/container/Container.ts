import type { ComponentConfig } from '../../types'

const ContainerSetters: ComponentConfig = {
  type: 'Container',
  name: 'Container',
  nameCn: '容器',
  props: {
    title: {
      type: 'Input',
      title: '标题',
      tooltip: '容器标题',
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
  // Container组件内部默认放置一个Row
  defaultChild: {
    type: 'Row',
    label: 'DefaultRow',
    model: 'DefaultRow',
    display: true,
    gutter: 0,
    children: []
  }
}

export default ContainerSetters
