import type { ComponentConfig } from '../../types'

const TimePickerSetters: ComponentConfig = {
  type: 'TimePicker',
  name: 'TimePicker',
  nameCn: '时间选择',
  props: {
    placeholder: {
      type: 'Input',
      title: '占位文本',
      required: false,
      default: '选择时间'
    },
    clearable: {
      type: 'Switch',
      title: '可清空',
      required: false,
      default: true
    },
    disabled: {
      type: 'Switch',
      title: '禁用',
      required: false,
      default: false
    },
    format: {
      type: 'Input',
      title: '显示格式',
      required: false,
      default: 'HH:mm:ss'
    }
  },
  events: {
    change: { label: '值改变', value: 'change' },
    blur: { label: '失去焦点', value: 'blur' },
    focus: { label: '获得焦点', value: 'focus' }
  },
  father: ['Row']
}

export default TimePickerSetters
