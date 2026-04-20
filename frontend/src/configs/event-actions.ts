/**
 * 事件动作配置
 */

export interface EventActionConfig {
  tag: string
  label: string
  method: string
  props: Array<{
    key: string
    label: string
    type: 'target' | 'prop' | 'value' | 'function' | 'expression'
    required?: boolean
    options?: any[]
    placeholder?: string
  }>
  description?: string
}

export const EVENT_ACTIONS: EventActionConfig[] = [
  {
    tag: 'setAttribute',
    label: '设置属性',
    method: 'set',
    props: [
      {
        key: 'target',
        label: '目标控件',
        type: 'target',
        required: true,
        placeholder: '选择要操作的控件'
      },
      {
        key: 'prop',
        label: '属性名',
        type: 'prop',
        required: true,
        options: [
          { label: '显示/隐藏', value: 'display' },
          { label: '禁用/启用', value: 'disabled' },
          { label: '必填/非必填', value: 'required' },
          { label: '值', value: 'value' },
          { label: '占位文本', value: 'placeholder' },
          { label: '最小值', value: 'min' },
          { label: '最大值', value: 'max' }
        ]
      },
      {
        key: 'value',
        label: '属性值',
        type: 'value',
        required: true,
        placeholder: '输入属性值'
      }
    ],
    description: '设置指定控件的属性值，可以是自身或其他控件'
  },
  {
    tag: 'show',
    label: '显示控件',
    method: 'show',
    props: [
      {
        key: 'target',
        label: '目标控件',
        type: 'target',
        required: true,
        placeholder: '选择要显示的控件'
      }
    ],
    description: '显示指定的控件（快捷操作）'
  },
  {
    tag: 'hide',
    label: '隐藏控件',
    method: 'hide',
    props: [
      {
        key: 'target',
        label: '目标控件',
        type: 'target',
        required: true,
        placeholder: '选择要隐藏的控件'
      }
    ],
    description: '隐藏指定的控件（快捷操作）'
  },
  {
    tag: 'enable',
    label: '启用控件',
    method: 'enable',
    props: [
      {
        key: 'target',
        label: '目标控件',
        type: 'target',
        required: true,
        placeholder: '选择要启用的控件'
      }
    ],
    description: '启用指定的控件（快捷操作）'
  },
  {
    tag: 'disable',
    label: '禁用控件',
    method: 'disable',
    props: [
      {
        key: 'target',
        label: '目标控件',
        type: 'target',
        required: true,
        placeholder: '选择要禁用的控件'
      }
    ],
    description: '禁用指定的控件（快捷操作）'
  },
  {
    tag: 'callFunction',
    label: '执行函数',
    method: 'call',
    props: [
      {
        key: 'functionName',
        label: '函数名称',
        type: 'function',
        required: true,
        placeholder: '选择或输入自定义函数名'
      },
      {
        key: 'args',
        label: '参数',
        type: 'expression',
        placeholder: '可选，函数参数（JSON格式）'
      }
    ],
    description: '执行预定义的自定义函数'
  },
  {
    tag: 'setValue',
    label: '设置值',
    method: 'setValue',
    props: [
      {
        key: 'target',
        label: '目标控件',
        type: 'target',
        required: true,
        placeholder: '选择要赋值的控件'
      },
      {
        key: 'value',
        label: '值',
        type: 'expression',
        required: true,
        placeholder: '支持表达式，如：formData.model1 + 100'
      }
    ],
    description: '设置指定控件的值'
  },
  {
    tag: 'dataMapping',
    label: '数据映射',
    method: 'map',
    props: [
      {
        key: 'target',
        label: '目标控件',
        type: 'target',
        required: true,
        placeholder: '选择要映射的控件'
      },
      {
        key: 'source',
        label: '数据源',
        type: 'expression',
        required: true,
        placeholder: '如：State.model1 或 formData.model2'
      }
    ],
    description: '从 State 或表单数据中映射数据到指定控件'
  },
  {
    tag: 'resetValue',
    label: '重置值',
    method: 'reset',
    props: [
      {
        key: 'target',
        label: '目标控件',
        type: 'target',
        required: true,
        placeholder: '选择要重置的控件，留空表示重置所有'
      }
    ],
    description: '重置指定控件的值为初始值'
  },
  {
    tag: 'clearValidate',
    label: '清除校验',
    method: 'clearValidate',
    props: [
      {
        key: 'target',
        label: '目标控件',
        type: 'target',
        placeholder: '选择要清除校验的控件，留空表示清除所有'
      }
    ],
    description: '清除指定控件的校验结果'
  }
]

// 根据标签获取事件动作配置
export function getEventActionConfig(tag: string): EventActionConfig | undefined {
  return EVENT_ACTIONS.find((a) => a.tag === tag)
}

// 获取所有事件动作标签
export function getEventActionTags(): string[] {
  return EVENT_ACTIONS.map((a) => a.tag)
}

// 获取事件动作选项（用于下拉选择）
export function getEventActionOptions(): Array<{ label: string; value: string }> {
  return EVENT_ACTIONS.map((a) => ({
    label: a.label,
    value: a.tag
  }))
}
