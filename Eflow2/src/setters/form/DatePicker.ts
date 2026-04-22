import type { ComponentConfig } from '../../types'

const DatePickerSetters: ComponentConfig = {
  type: 'DatePicker',
  name: 'DatePicker',
  nameCn: '日期选择',
  props: {
    type: {
      type: 'Select',
      title: '选择器类型',
      required: false,
      default: 'date',
      options: [
        { label: '年', value: 'year' },
        { label: '月', value: 'month' },
        { label: '日期', value: 'date' },
        { label: '日期时间', value: 'datetime' },
        { label: '日期范围', value: 'daterange' },
        { label: '日期时间范围', value: 'datetimerange' }
      ]
    },
    placeholder: {
      type: 'Input',
      title: '占位文本',
      required: false,
      default: '选择日期'
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
      default: 'YYYY-MM-DD'
    }
  },
  events: {
    change: { label: '值改变', value: 'change' },
    blur: { label: '失去焦点', value: 'blur' },
    focus: { label: '获得焦点', value: 'focus' }
  },
  father: ['Row']
}

export default DatePickerSetters
