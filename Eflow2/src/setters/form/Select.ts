import type { ComponentConfig } from '../../types'

const SelectSetters: ComponentConfig = {
  type: 'Select',
  name: 'Select',
  nameCn: '下拉选择',
  props: {
    placeholder: {
      type: 'Input',
      title: '占位文本',
      required: false,
      default: '请选择'
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
    multiple: {
      type: 'Switch',
      title: '多选',
      required: false,
      default: false
    },
    filterable: {
      type: 'Switch',
      title: '可搜索',
      required: false,
      default: false
    }
  },
  events: {
    change: { label: '值改变', value: 'change' },
    visibleChange: { label: '下拉框显示/隐藏', value: 'visibleChange' },
    removeTag: { label: '移除标签', value: 'removeTag' },
    clear: { label: '清空', value: 'clear' },
    blur: { label: '失去焦点', value: 'blur' },
    focus: { label: '获得焦点', value: 'focus' }
  },
  father: ['Row']
}

export default SelectSetters
