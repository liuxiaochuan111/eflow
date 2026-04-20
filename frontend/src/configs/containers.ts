/**
 * 容器配置清单
 */

import type { ContainerConfig } from '@/types'

export const CONTAINER_CONFIG: ContainerConfig[] = [
  {
    type: 'Container',
    name: 'Block',
    label: '区块容器',
    labelEn: 'Block Container',
    icon: 'Files',
    props: {
      className: {
        component: 'Input',
        default: '',
        type: 'String',
        label: 'CSS类名',
        placeholder: '自定义class名称'
      },
      style: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '自定义样式',
        placeholder: '例如：padding: 20px; background: #f5f5f5'
      }
    },
    father: [''] // 顶层容器，可以放置在任何地方
  },
  {
    type: 'Container',
    name: 'Container',
    label: '通用容器',
    labelEn: 'Container',
    icon: 'Box',
    props: {
      padding: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '内边距',
        min: 0,
        max: 100
      },
      margin: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '外边距',
        min: 0,
        max: 100
      },
      background: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '背景色',
        placeholder: '例如：#f5f5f5'
      },
      border: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '显示边框'
      }
    },
    father: ['Block', 'Container', 'Form', 'Row']
  },
  {
    type: 'Container',
    name: 'Form',
    label: '表单容器',
    labelEn: 'Form',
    icon: 'Document',
    props: {
      labelPosition: {
        component: 'Select',
        default: 'top',
        type: 'String',
        label: '标签位置',
        options: [
          { label: '顶部', value: 'top' },
          { label: '右侧', value: 'right' },
          { label: '左侧', value: 'left' }
        ]
      },
      labelWidth: {
        component: 'InputNumber',
        default: 100,
        type: 'Number',
        label: '标签宽度',
        min: 50,
        max: 300,
        step: 10
      },
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '表单尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用表单'
      }
    },
    father: ['Block', 'Container', 'Form', 'Row']
  },
  {
    type: 'Container',
    name: 'Row',
    label: '栅格容器',
    labelEn: 'Row',
    icon: 'Grid',
    props: {
      gutter: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '栅格间隔',
        min: 0,
        max: 100,
        step: 5
      },
      justify: {
        component: 'Select',
        default: 'start',
        type: 'String',
        label: '水平排列',
        options: [
          { label: '起始', value: 'start' },
          { label: '居中', value: 'center' },
          { label: '终点', value: 'end' },
          { label: '两端对齐', value: 'space-between' },
          { label: '均匀分布', value: 'space-around' }
        ]
      },
      align: {
        component: 'Select',
        default: 'top',
        type: 'String',
        label: '垂直对齐',
        options: [
          { label: '顶部', value: 'top' },
          { label: '居中', value: 'middle' },
          { label: '底部', value: 'bottom' }
        ]
      }
    },
    father: ['Form', 'Block', 'Container']
  }
]

// 根据名称获取容器配置
export function getContainerConfig(name: string): ContainerConfig | undefined {
  return CONTAINER_CONFIG.find((c) => c.name === name)
}

// 获取所有容器名称
export function getContainerNames(): string[] {
  return CONTAINER_CONFIG.map((c) => c.name)
}
