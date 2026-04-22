import type { ComponentConfig } from '../../types'

const RowSetters: ComponentConfig = {
  type: 'Row',
  name: 'Row',
  nameCn: '行',
  props: {
    gutter: {
      type: 'InputNumber',
      title: '栅格间隔',
      required: false,
      default: 0
    },
    justify: {
      type: 'Select',
      title: '水平排列方式',
      required: false,
      default: 'start',
      options: [
        { label: '起始位置', value: 'start' },
        { label: '居中', value: 'center' },
        { label: '末尾位置', value: 'end' },
        { label: '空间平均分配', value: 'space-around' },
        { label: '两端对齐', value: 'space-between' }
      ]
    },
    align: {
      type: 'Select',
      title: '垂直对齐方式',
      required: false,
      default: 'top',
      options: [
        { label: '顶部对齐', value: 'top' },
        { label: '居中', value: 'middle' },
        { label: '底部对齐', value: 'bottom' }
      ]
    },
    display: {
      type: 'Switch',
      title: '显示',
      required: false,
      default: true
    }
  },
  father: ['Block', 'Container']
}

export default RowSetters
