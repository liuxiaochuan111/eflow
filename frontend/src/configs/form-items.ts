/**
 * 表单项配置清单
 * 根据 Element Plus 官方文档完整配置
 * 包含所有关键属性字段，对应 schema 数据结构
 */

import type { FormItemConfig } from '@/types'

export const FORM_ITEM_CONFIG: FormItemConfig[] = [
  // ==================== Input 输入框 ====================
  {
    type: 'FormItem',
    name: 'Input',
    label: '输入框',
    labelEn: 'Input',
    icon: 'EditPen',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名',
        description: '表单数据对象中的键名，用于 v-model 绑定'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本',
        placeholder: '表单项的标签名称'
      },

      // === 基础属性 ===
      placeholder: {
        component: 'Input',
        default: '请输入',
        type: 'String',
        label: '占位文本'
      },
      clearable: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '可清空'
      },
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },

      // === 类型相关 ===
      type: {
        component: 'Select',
        default: 'text',
        type: 'String',
        label: '输入框类型',
        options: [
          { label: '文本', value: 'text' },
          { label: '文本域', value: 'textarea' },
          { label: '密码', value: 'password' },
          { label: '数字', value: 'number' },
          { label: '邮箱', value: 'email' },
          { label: 'URL', value: 'url' },
          { label: '搜索', value: 'search' },
          { label: '电话', value: 'tel' },
          { label: '日期', value: 'date' },
          { label: '时间', value: 'time' },
          { label: ' datetime-local', value: 'datetime-local' },
          { label: '月份', value: 'month' },
          { label: '周', value: 'week' }
        ]
      },

      // === 验证相关 ===
      maxlength: {
        component: 'InputNumber',
        default: 50,
        type: 'Number',
        label: '最大长度',
        min: 0,
        max: 500,
        placeholder: '0表示不限制'
      },
      minlength: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '最小长度',
        min: 0
      },
      showWordLimit: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '显示字数统计',
        description: '显示输入字符数统计'
      },
      pattern: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '正则表达式',
        placeholder: '例如: ^[a-zA-Z]+$',
        description: '用于输入验证的正则表达式'
      },
      validateEvent: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '触发验证'
      },

      // === 图标相关 ===
      prefixIcon: {
        component: 'Select',
        default: '',
        type: 'String',
        label: '前缀图标',
        options: [
          { label: '无', value: '' },
          { label: '搜索', value: 'Search' },
          { label: '用户', value: 'User' },
          { label: '电话', value: 'Phone' },
          { label: '日历', value: 'Calendar' },
          { label: '邮箱', value: 'Message' },
          { label: '位置', value: 'Location' },
          { label: '锁', value: 'Lock' },
          { label: '星星', value: 'Star' },
          { label: '眼睛', value: 'View' },
          { label: '文件', value: 'Document' }
        ]
      },
      suffixIcon: {
        component: 'Select',
        default: '',
        type: 'String',
        label: '后缀图标',
        options: [
          { label: '无', value: '' },
          { label: '日历', value: 'Calendar' },
          { label: '搜索', value: 'Search' },
          { label: '眼睛', value: 'View' },
          { label: '关闭', value: 'Close' },
          { label: '箭头', value: 'ArrowUp' }
        ]
      },

      // === 样式相关 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },

      // === 高级属性 ===
      readonly: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '只读'
      },
      autofocus: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '自动聚焦',
        description: '自动获取焦点'
      },
      autocomplete: {
        component: 'Input',
        default: 'off',
        type: 'String',
        label: '自动完成',
        placeholder: 'on/off'
      },

      // === 文本域特定属性 ===
      rows: {
        component: 'InputNumber',
        default: 2,
        type: 'Number',
        label: '文本域行数',
        min: 2,
        max: 10,
        description: 'type为textarea时有效'
      },
      autosize: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '自适应高度',
        description: 'type为textarea时有效'
      },
      resize: {
        component: 'Select',
        default: 'vertical',
        type: 'String',
        label: '调整大小方向',
        options: [
          { label: '垂直', value: 'vertical' },
          { label: '水平', value: 'horizontal' },
          { label: '两者', value: 'both' },
          { label: '无', value: 'none' }
        ]
      }
    },
    events: ['change', 'input', 'focus', 'blur', 'clear', 'keydown', 'keyup'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { prefix: '前缀', suffix: '后缀', prepend: '前插入', append: '后插入' },
    defaultOptions: {
      clearable: true,
      placeholder: '请输入'
    }
  },

  // ==================== InputNumber 数字输入框 ====================
  {
    type: 'FormItem',
    name: 'InputNumber',
    label: '数字输入框',
    labelEn: 'InputNumber',
    icon: 'Histogram',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名',
        description: '表单数据对象中的键名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本',
        placeholder: '表单项的标签名称'
      },

      // === 范围控制 ===
      min: {
        component: 'InputNumber',
        default: -Infinity,
        type: 'Number',
        label: '最小值',
        placeholder: '无限制'
      },
      max: {
        component: 'InputNumber',
        default: Infinity,
        type: 'Number',
        label: '最大值',
        placeholder: '无限制'
      },
      step: {
        component: 'InputNumber',
        default: 1,
        type: 'Number',
        label: '步长',
        min: 0.01,
        step: 0.01,
        precision: 4
      },
      stepStrictly: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '严格步长',
        description: '只能输入步长的倍数'
      },
      precision: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '精度',
        min: 0,
        max: 20,
        description: '小数位数'
      },

      // === 显示控制 ===
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },
      controls: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '显示控制按钮'
      },
      controlsPosition: {
        component: 'Select',
        default: 'right',
        type: 'String',
        label: '控制按钮位置',
        options: [
          { label: '右侧', value: 'right' },
          { label: '两侧', value: '' },
          { label: '不显示', value: 'false' }
        ]
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },
      placeholder: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '占位文本'
      },

      // === 高级 ===
      readonly: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '只读'
      },
      autofocus: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '自动聚焦'
      },
      name: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名'
      },
      validateEvent: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '触发验证'
      }
    },
    events: ['change', 'focus', 'blur'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { prefix: '前缀', suffix: '后缀' },
    defaultOptions: {
      step: 1,
      controls: true,
      controlsPosition: 'right'
    }
  },

  // ==================== Select 选择器 ====================
  {
    type: 'FormItem',
    name: 'Select',
    label: '选择器',
    labelEn: 'Select',
    icon: 'ArrowDown',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名',
        description: '表单数据对象中的键名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本',
        placeholder: '表单项的标签名称'
      },

      // === 基础属性 ===
      placeholder: {
        component: 'Input',
        default: '请选择',
        type: 'String',
        label: '占位文本'
      },
      clearable: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '可清空'
      },
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },

      // === 多选相关 ===
      multiple: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '多选',
        description: '启用后可选择多个值'
      },
      multipleLimit: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '多选限制数量',
        min: 0,
        placeholder: '0表示不限制'
      },
      collapseTags: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '折叠标签',
        description: '多选时折叠选中项'
      },
      collapseTagsTooltip: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '折叠提示'
      },
      maxCollapseTags: {
        component: 'InputNumber',
        default: 1,
        type: 'Number',
        label: '最大折叠标签数',
        min: 1
      },

      // === 搜索相关 ===
      filterable: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '可筛选',
        description: '可搜索选项'
      },
      allowCreate: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '允许创建',
        description: '允许用户创建新选项'
      },
      remote: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '远程搜索',
        description: '从远程服务器获取数据'
      },
      remoteMethod: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '远程方法名',
        placeholder: '远程搜索方法函数名',
        description: 'remote为true时有效'
      },
      loading: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '加载中'
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },

      // === 高级 ===
      popperClass: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '下拉框类名',
        placeholder: '自定义下拉框的CSS类名'
      },
      reserveKeyword: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '保留关键词',
        description: '选中选项后保留当前的搜索关键词'
      },

      // === 数据配置 ===
      options: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '选项数据',
        placeholder: 'JSON数组，例如：[{"label":"选项1","value":"1"}]',
        description: '下拉选项的数据源'
      },
      props: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '配置选项',
        placeholder: 'JSON对象，配置选项的行为',
        description: 'Element Plus Select组件的配置项'
      }
    },
    events: ['change', 'visibleChange', 'removeTag', 'clear', 'blur', 'focus'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { prefix: '前缀', empty: '空状态', default: '默认内容', loading: '加载中', tag: '标签' },
    defaultOptions: {
      clearable: true,
      filterable: false,
      placeholder: '请选择'
    }
  },

  // ==================== DatePicker 日期选择器 ====================
  {
    type: 'FormItem',
    name: 'DatePicker',
    label: '日期选择器',
    labelEn: 'DatePicker',
    icon: 'Calendar',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名',
        description: '表单数据对象中的键名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本',
        placeholder: '表单项的标签名称'
      },

      // === 类型选择 ===
      type: {
        component: 'Select',
        default: 'date',
        type: 'String',
        label: '选择器类型',
        options: [
          { label: '年', value: 'year' },
          { label: '月', value: 'month' },
          { label: '日期', value: 'date' },
          { label: '日期时间', value: 'datetime' },
          { label: '日期范围', value: 'daterange' },
          { label: '月范围', value: 'monthrange' },
          { label: '日期时间范围', value: 'datetimerange' }
        ]
      },

      // === 基础属性 ===
      placeholder: {
        component: 'Input',
        default: '请选择日期',
        type: 'String',
        label: '占位文本'
      },
      startPlaceholder: {
        component: 'Input',
        default: '开始日期',
        type: 'String',
        label: '开始占位',
        description: '范围选择时的开始日期占位'
      },
      endPlaceholder: {
        component: 'Input',
        default: '结束日期',
        type: 'String',
        label: '结束占位',
        description: '范围选择时的结束日期占位'
      },
      clearable: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '可清空'
      },
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },
      editable: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '可编辑',
        description: '允许输入日期'
      },
      readonly: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '只读'
      },

      // === 格式化 ===
      format: {
        component: 'Input',
        default: 'YYYY-MM-DD',
        type: 'String',
        label: '显示格式',
        placeholder: '例如：YYYY-MM-DD HH:mm:ss',
        description: '在输入框中显示的格式'
      },
      valueFormat: {
        component: 'Input',
        default: 'YYYY-MM-DD',
        type: 'String',
        label: '绑定值格式',
        placeholder: '例如：YYYY-MM-DD HH:mm:ss',
        description: '绑定到model的值的格式'
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },

      // === 限制 ===
      disabledDate: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '禁用日期函数',
        placeholder: '函数名',
        description: '禁止选择的日期的函数'
      },
      startDate: {
        component: 'DatePicker',
        default: '',
        type: 'String',
        label: '开始日期',
        description: '可选的最早日期'
      },
      endDate: {
        component: 'DatePicker',
        default: '',
        type: 'String',
        label: '结束日期',
        description: '可选的最晚日期'
      }
    },
    events: ['change', 'blur', 'focus', 'visibleChange'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { rangeSeparator: '范围分隔符', default: '默认内容' },
    defaultOptions: {
      type: 'date',
      clearable: true,
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      placeholder: '请选择日期'
    }
  },

  // ==================== TimePicker 时间选择器 ====================
  {
    type: 'FormItem',
    name: 'TimePicker',
    label: '时间选择器',
    labelEn: 'TimePicker',
    icon: 'Clock',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本'
      },

      // === 类型 ===
      isRange: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '范围选择'
      },

      // === 基础属性 ===
      placeholder: {
        component: 'Input',
        default: '请选择时间',
        type: 'String',
        label: '占位文本'
      },
      startPlaceholder: {
        component: 'Input',
        default: '开始时间',
        type: 'String',
        label: '开始占位'
      },
      endPlaceholder: {
        component: 'Input',
        default: '结束时间',
        type: 'String',
        label: '结束占位'
      },
      clearable: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '可清空'
      },
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },
      editable: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '可编辑'
      },
      readonly: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '只读'
      },

      // === 格式化 ===
      format: {
        component: 'Input',
        default: 'HH:mm:ss',
        type: 'String',
        label: '显示格式',
        placeholder: '例如：HH:mm:ss'
      },
      valueFormat: {
        component: 'Input',
        default: 'HH:mm:ss',
        type: 'String',
        label: '绑定值格式',
        placeholder: '例如：HH:mm:ss'
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },

      // === 限制 ===
      disabledHours: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '禁用小时函数',
        placeholder: '函数名'
      },
      disabledMinutes: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '禁用分钟函数',
        placeholder: '函数名'
      },
      disabledSeconds: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '禁用秒数函数',
        placeholder: '函数名'
      }
    },
    events: ['change', 'blur', 'focus', 'visibleChange'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: {},
    defaultOptions: {
      clearable: true,
      format: 'HH:mm:ss',
      valueFormat: 'HH:mm:ss',
      placeholder: '请选择时间'
    }
  },

  // ==================== Radio 单选框 ====================
  {
    type: 'FormItem',
    name: 'Radio',
    label: '单选框',
    labelEn: 'Radio',
    icon: 'CircleCheck',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本',
        placeholder: '单选框组的标签'
      },

      // === 基础属性 ===
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },

      // === 数据配置 ===
      options: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '选项数据',
        placeholder: 'JSON数组，例如：[{"label":"选项1","value":"1"}]',
        description: '单选项的数据源'
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },
      border: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '边框样式'
      },
      buttonStyle: {
        component: 'Select',
        default: '',
        type: 'String',
        label: '按钮样式',
        options: [
          { label: '默认', value: '' },
          { label: '固体', value: 'solid' }
        ]
      },

      // === 颜色配置 ===
      textColor: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '文字颜色',
        placeholder: '例如：#409eff',
        description: '选中时的文字颜色'
      },
      fill: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '填充颜色',
        placeholder: '例如：#409eff',
        description: '选中时的背景颜色'
      },

      // === 高级 ===
      change: {
        component: 'Input',
        default: '',
        type: 'String',
        label: 'change事件处理',
        placeholder: 'change事件函数名'
      }
    },
    events: ['change'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { default: '默认内容' },
    defaultOptions: {
      border: false
    }
  },

  // ==================== Checkbox 复选框 ====================
  {
    type: 'FormItem',
    name: 'Checkbox',
    label: '复选框',
    labelEn: 'Checkbox',
    icon: 'Select',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本',
        placeholder: '复选框组的标签'
      },

      // === 基础属性 ===
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },

      // === 数据配置 ===
      trueLabel: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '选中时的值',
        placeholder: '选中时显示的文字'
      },
      falseLabel: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '未选中时的值',
        placeholder: '未选中时显示的文字'
      },
      options: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '选项数据',
        placeholder: 'JSON数组'
      },

      // === 限制 ===
      min: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '最小选中数',
        min: 0,
        placeholder: '0表示不限制'
      },
      max: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '最大选中数',
        min: 0,
        placeholder: '0表示不限制'
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },
      border: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '边框样式'
      },
      buttonStyle: {
        component: 'Select',
        default: '',
        type: 'String',
        label: '按钮样式',
        options: [
          { label: '默认', value: '' },
          { label: '固体', value: 'solid' }
        ]
      },

      // === 状态 ===
      indeterminate: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '半选状态',
        description: '表示选中的不确定状态'
      },

      // === 颜色配置 ===
      textColor: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '文字颜色'
      },
      fill: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '填充颜色'
      }
    },
    events: ['change'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { default: '默认内容' },
    defaultOptions: {
      border: false
    }
  },

  // ==================== Switch 开关 ====================
  {
    type: 'FormItem',
    name: 'Switch',
    label: '开关',
    labelEn: 'Switch',
    icon: 'Open',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本',
        placeholder: '开关的说明文字'
      },

      // === 基础属性 ===
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },
      loading: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '加载中'
      },

      // === 文本显示 ===
      activeText: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '打开时文字',
        placeholder: '例如：启用、开、ON'
      },
      inactiveText: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '关闭时文字',
        placeholder: '例如：禁用、关、OFF'
      },
      inlinePrompt: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '行内提示',
        description: '文字和开关在同一行显示'
      },

      // === 颜色 ===
      activeColor: {
        component: 'Input',
        default: '#409eff',
        type: 'String',
        label: '打开时颜色',
        placeholder: '例如：#67c23a'
      },
      inactiveColor: {
        component: 'Input',
        default: '#dcdfe6',
        type: 'String',
        label: '关闭时颜色',
        placeholder: '例如：#dcdfe6'
      },

      // === 图标 ===
      activeIcon: {
        component: 'Select',
        default: '',
        type: 'String',
        label: '打开时图标',
        options: [
          { label: '无', value: '' },
          { label: '对勾', value: 'Check' },
          { label: '星星', value: 'Star' },
          { label: '圆', value: 'CircleCheck' }
        ]
      },
      inactiveIcon: {
        component: 'Select',
        default: '',
        type: 'String',
        label: '关闭时图标',
        options: [
          { label: '无', value: '' },
          { label: '关闭', value: 'Close' },
          { label: '圆', value: 'CircleClose' }
        ]
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },
      width: {
        component: 'InputNumber',
        default: 40,
        type: 'Number',
        label: '宽度',
        min: 20,
        max: 100
      },

      // === 值配置 ===
      activeValue: {
        component: 'Input',
        default: 'true',
        type: 'String',
        label: '打开时的值',
        placeholder: '例如：true、1、yes'
      },
      inactiveValue: {
        component: 'Input',
        default: 'false',
        type: 'String',
        label: '关闭时的值',
        placeholder: '例如：false、0、no'
      },
      validateEvent: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '触发验证'
      },

      // === 高级 ===
      beforeChange: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '切换前钩子',
        placeholder: '函数名',
        description: '切换前的钩子函数，返回false可阻止切换'
      }
    },
    events: ['change'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { active: '打开时内容', inactive: '关闭时内容', icon: '图标' },
    defaultOptions: {
      activeColor: '#409eff',
      inactiveColor: '#dcdfe6'
    }
  },

  // ==================== Slider 滑块 ====================
  {
    type: 'FormItem',
    name: 'Slider',
    label: '滑块',
    labelEn: 'Slider',
    icon: 'Minus',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本',
        placeholder: '滑块的说明文字'
      },

      // === 范围控制 ===
      min: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '最小值'
      },
      max: {
        component: 'InputNumber',
        default: 100,
        type: 'Number',
        label: '最大值'
      },
      step: {
        component: 'InputNumber',
        default: 1,
        type: 'Number',
        label: '步长',
        min: 0.01
      },
      stepStrictly: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '严格步长',
        description: '只能输入步长的倍数'
      },
      showStops: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '显示间断点',
        description: '显示关键值的标记点'
      },

      // === 显示控制 ===
      showTooltip: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '显示提示'
      },
      range: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '范围选择',
        description: '启用后可选择范围'
      },
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },

      // === 垂直模式 ===
      vertical: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '垂直模式',
        description: '启用后滑块垂直显示'
      },
      height: {
        component: 'InputNumber',
        default: 200,
        type: 'Number',
        label: '高度',
        min: 50,
        max: 500,
        placeholder: '垂直模式时有效'
      },

      // === 标记和提示 ===
      marks: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标记点',
        placeholder: 'JSON对象，例如：{0:"0%",50:"50%"}',
        description: '标记点的标签，key为位置，value为标签'
      },
      tooltipClass: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '提示框类名'
      },
      formatTooltip: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '格式化提示',
        placeholder: '格式化显示的函数名'
      },

      // === 输入框 ===
      showInput: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '显示输入框',
        description: '显示数字输入框'
      },
      showInputControls: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '输入框控制按钮'
      },
      inputSize: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '输入框尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },

      // === 验证 ===
      validateEvent: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '触发验证'
      },

      // === 高级 ===
      beforeChange: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '变化前钩子',
        placeholder: '函数名',
        description: '数值改变前的钩子函数'
      }
    },
    events: ['change', 'input'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: {},
    defaultOptions: {
      min: 0,
      max: 100,
      step: 1,
      showTooltip: true
    }
  },

  // ==================== Upload 上传 ====================
  {
    type: 'FormItem',
    name: 'Upload',
    label: '上传',
    labelEn: 'Upload',
    icon: 'Upload',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本',
        placeholder: '上传组件的说明'
      },

      // === 必填 ===
      action: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '上传地址',
        required: true,
        placeholder: '文件上传的API地址',
        description: '必需，文件上传的目标API地址'
      },

      // === 基础属性 ===
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },

      // === 文件限制 ===
      limit: {
        component: 'InputNumber',
        default: 3,
        type: 'Number',
        label: '上传数量限制',
        min: 1,
        placeholder: '0表示不限制'
      },
      fileSizeLimit: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '文件大小限制(MB)',
        min: 0,
        placeholder: '0表示不限制',
        description: '文件大小上限，单位MB'
      },
      accept: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '接受文件类型',
        placeholder: '例如：.jpg,.png,.pdf',
        description: '接受的文件扩展名，用逗号分隔'
      },

      // === 功能配置 ===
      multiple: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '多选文件',
        description: '允许同时上传多个文件'
      },
      drag: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '拖拽上传',
        description: '启用拖拽上传区域'
      },
      autoUpload: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '自动上传',
        description: '选择文件后立即上传'
      },
      showFileList: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '显示文件列表',
        description: '显示已上传文件列表'
      },
      thumbnailMode: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '缩略图模式',
        description: '缩略图预览模式'
      },

      // === 样式 ===
      listType: {
        component: 'Select',
        default: 'picture',
        type: 'String',
        label: '列表类型',
        options: [
          { label: '文本', value: 'text' },
          { label: '图片', value: 'picture' },
          { label: '图片卡片', value: 'picture-card' }
        ]
      },

      // === 数据配置 ===
      name: {
        component: 'Input',
        default: 'file',
        type: 'String',
        label: '文件字段名',
        description: '上传文件的表单字段名'
      },
      data: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '附加数据',
        placeholder: 'JSON对象',
        description: '上传时附带的额外数据'
      },
      headers: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '请求头部',
        placeholder: 'JSON对象',
        description: '上传请求的HTTP头部'
      },
      withCredentials: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '发送Cookie',
        description: '携带跨域cookie'
      }
    },
    events: ['change', 'preview', 'remove', 'success', 'error', 'progress', 'exceed'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { trigger: '触发器', tip: '提示文本', file: '文件内容' },
    defaultOptions: {
      listType: 'picture',
      showFileList: true,
      autoUpload: true
    }
  },

  // ==================== Cascader 级联选择器 ====================
  {
    type: 'FormItem',
    name: 'Cascader',
    label: '级联选择器',
    labelEn: 'Cascader',
    icon: 'Operation',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本'
      },

      // === 基础属性 ===
      placeholder: {
        component: 'Input',
        default: '请选择',
        type: 'String',
        label: '占位文本'
      },
      clearable: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '可清空'
      },
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },

      // === 数据配置 ===
      options: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '选项数据',
        placeholder: 'JSON树形数据',
        description: '级联选项的树形数据源'
      },
      props: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '配置选项',
        placeholder: 'JSON对象',
        description: '配置级联选择器的行为'
      },

      // === 多选配置 ===
      multiple: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '多选',
        description: '可选中多个值'
      },
      collapseTags: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '折叠标签',
        description: '多选时折叠选中项'
      },
      collapseTagsTooltip: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '折叠提示'
      },
      maxCollapseTags: {
        component: 'InputNumber',
        default: 1,
        type: 'Number',
        label: '最大折叠数',
        min: 1
      },

      // === 搜索配置 ===
      filterable: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '可搜索',
        description: '可搜索选项'
      },
      remote: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '远程搜索',
        description: '从远程服务器搜索'
      },
      remoteMethod: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '远程方法名',
        placeholder: '函数名',
        description: '远程搜索方法函数'
      },
      loading: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '加载中'
      },

      // === 配置 ===
      separator: {
        component: 'Input',
        default: '/',
        type: 'String',
        label: '分隔符',
        placeholder: '例如：/ 或 -'
      },
      showAllLevels: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '显示所有层级',
        description: '显示选中路径的完整层级'
      },
      checkStrictly: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '任意级可选',
        description: '可选择任意级别的选项'
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },
      popperClass: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '下拉框类名'
      },

      // === 高级 ===
      beforeFilter: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '搜索前钩子',
        placeholder: '函数名'
      }
    },
    events: ['change', 'visibleChange', 'expandChange', 'removeTag'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { default: '自定义内容' },
    defaultOptions: {
      clearable: true,
      filterable: false,
      showAllLevels: true
    }
  },

  // ==================== Rate 评分 ====================
  {
    type: 'FormItem',
    name: 'Rate',
    label: '评分',
    labelEn: 'Rate',
    icon: 'Star',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本'
      },

      // === 基础属性 ===
      max: {
        component: 'InputNumber',
        default: 5,
        type: 'Number',
        label: '最大分值',
        min: 1
      },
      allowHalf: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '允许半选',
        description: '支持0.5分选择'
      },
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },

      // === 颜色 ===
      color: {
        component: 'Input',
        default: '#f7ba2a',
        type: 'String',
        label: '选中颜色',
        placeholder: '例如：#f7ba2a'
      },
      voidColor: {
        component: 'Input',
        default: '#c6d1de',
        type: 'String',
        label: '未选中颜色',
        placeholder: '例如：#c6d1de'
      },
      disabledVoidColor: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '禁用未选中颜色',
        placeholder: '例如：#eff2f1'
      },

      // === 图标 ===
      iconClass: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '图标类名',
        placeholder: '自定义图标的类名'
      },
      voidIconClass: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '未选中图标类名',
        placeholder: '自定义未选中图标的类名'
      },

      // === 显示 ===
      showScore: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '显示分数',
        description: '显示当前分数'
      },
      scoreTemplate: {
        component: 'Input',
        default: '{value}',
        type: 'String',
        label: '分数模板',
        placeholder: '例如：{value}分'
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },
      gap: {
        component: 'InputNumber',
        default: 8,
        type: 'Number',
        label: '间距',
        min: 0
      },
      silent: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '静默模式',
        description: '不显示提示信息'
      }
    },
    events: ['change'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: {},
    defaultOptions: {
      max: 5,
      allowHalf: false
    }
  },

  // ==================== ColorPicker 颜色选择器 ====================
  {
    type: 'FormItem',
    name: 'ColorPicker',
    label: '颜色选择器',
    labelEn: 'ColorPicker',
    icon: 'Brush',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本'
      },

      // === 基础属性 ===
      modelValue: {
        component: 'Input',
        default: '#409eff',
        type: 'String',
        label: '默认颜色',
        placeholder: '例如：#409eff'
      },
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },

      // === 显示配置 ===
      showAlpha: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '支持透明度',
        description: '启用后可以选择带透明度的颜色'
      },
      colorFormat: {
        component: 'Select',
        default: 'hex',
        type: 'String',
        label: '颜色格式',
        options: [
          { label: 'HEX', value: 'hex' },
          { label: 'RGB', value: 'rgb' },
          { label: 'HSL', value: 'hsl' },
          { label: 'HSV', value: 'hsv' },
          { label: 'CMYK', value: 'cmyk' }
        ]
      },

      // === 预定义颜色 ===
      predefine: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '预定义颜色',
        placeholder: 'JSON数组，例如：["#409eff", "#67c23a"]',
        description: '预设的颜色选项'
      },

      // === 高级 ===
      popperClass: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '下拉框类名'
      },
      disabledAlpha: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用透明度',
        description: '禁止调整透明度'
      }
    },
    events: ['change', 'activeChange'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { default: '默认内容' },
    defaultOptions: {
      modelValue: '#409eff',
      showAlpha: false,
      colorFormat: 'hex'
    }
  },

  // ==================== Transfer 穿梭框 ====================
  {
    type: 'FormItem',
    name: 'Transfer',
    label: '穿梭框',
    labelEn: 'Transfer',
    icon: 'Switch',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本'
      },

      // === 数据源配置 ===
      data: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '数据源',
        required: true,
        placeholder: 'JSON数组',
        description: '穿梭框的数据源，数组对象包含key和label'
      },
      props: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '数据源配置',
        placeholder: 'JSON对象',
        description: '配置数据源的行为'
      },

      // === 显示配置 ===
      titles: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标题',
        placeholder: 'JSON数组，例如：["列表1", "列表2"]',
        description: '左右两侧列表的标题'
      },
      buttonTexts: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '按钮文字',
        placeholder: 'JSON数组'
      },

      // === 目标配置 ===
      targetOrder: {
        component: 'Select',
        default: 'original',
        type: 'String',
        label: '目标列表排序',
        options: [
          { label: '原始', value: 'original' },
          { label: '推入', value: 'push' },
          { label: '无', value: 'unshift' }
        ]
      },

      // === 过滤 ===
      filterable: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '可搜索',
        description: '可搜索选项'
      },
      filterMethod: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '过滤方法',
        placeholder: '函数名'
      },

      // === 默认选中 ===
      defaultTarget: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '默认目标',
        placeholder: '数组索引'
      },
      leftDefaultChecked: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '左侧默认选中',
        placeholder: '数组索引'
      },
      rightDefaultChecked: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '右侧默认选中',
        placeholder: '数组索引'
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      }
    },
    events: ['change', 'leftCheckChange', 'rightCheckChange'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { default: '默认内容' },
    defaultOptions: {
      filterable: false
    }
  },

  // ==================== TreeSelect 树形选择 ====================
  {
    type: 'FormItem',
    name: 'TreeSelect',
    label: '树形选择',
    labelEn: 'TreeSelect',
    icon: 'Guide',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本'
      },

      // === 数据配置 ===
      data: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '树形数据',
        placeholder: 'JSON树形数据',
        description: '树形结构的数据源'
      },
      props: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '配置选项',
        placeholder: 'JSON对象',
        description: '配置树形选择器的行为'
      },
      nodeKey: {
        component: 'Input',
        default: 'id',
        type: 'String',
        label: '节点唯一标识',
        description: '每个树节点的唯一标识字段'
      },

      // === 基础属性 ===
      placeholder: {
        component: 'Input',
        default: '请选择',
        type: 'String',
        label: '占位文本'
      },
      clearable: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '可清空'
      },
      disabled: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '禁用'
      },

      // === 多选配置 ===
      multiple: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '多选',
        description: '可选中多个节点'
      },
      collapseTags: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '折叠标签',
        description: '多选时折叠选中项'
      },
      collapseTagsTooltip: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '折叠提示'
      },
      maxCollapseTags: {
        component: 'InputNumber',
        default: 1,
        type: 'Number',
        label: '最大折叠数',
        min: 1
      },
      showCheckbox: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '显示复选框',
        description: '每个节点前显示复选框'
      },

      // === 搜索 ===
      filterable: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '可搜索',
        description: '可搜索节点'
      },

      // === 展开配置 ===
      defaultExpandAll: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '默认展开所有',
        description: '默认展开所有节点'
      },
      expandOnClickNode: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '点击展开',
        description: '点击节点展开子节点'
      },
      checkOnClickNode: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '点击选中',
        description: '点击节点选中'
      },
      renderAfterExpand: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '展开后渲染',
        description: '节点展开后才渲染子节点'
      },
      highlightCurrentRow: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '高亮当前行',
        description: '当前选中的节点高亮'
      },

      // === 样式 ===
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      }
    },
    events: ['change', 'nodeClick'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: { default: '自定义内容' },
    defaultOptions: {
      clearable: true,
      filterable: false,
      expandOnClickNode: true
    }
  },

  // ==================== Table 表格 ====================
  {
    type: 'FormItem',
    name: 'Table',
    label: '表格',
    labelEn: 'Table',
    icon: 'Grid',
    props: {
      // === 数据绑定字段 ===
      model: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '字段名(model)',
        required: true,
        placeholder: '用于数据绑定的字段名',
        description: '表单数据对象中的键名，用于绑定表格数据'
      },
      label: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '标签文本',
        placeholder: '表格的标签名称'
      },

      // === 列配置 ===
      columns: {
        component: 'Input',
        default: '[]',
        type: 'String',
        label: '列配置',
        required: true,
        placeholder: 'JSON数组，例如：[{"prop":"name","label":"姓名","width":120}]',
        description: '表格列的配置项数组，包含prop、label、width等属性'
      },

      // === 基础属性 ===
      border: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '边框',
        description: '是否显示纵向边框'
      },
      stripe: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '斑马纹',
        description: '是否显示斑马纹'
      },
      size: {
        component: 'Select',
        default: 'default',
        type: 'String',
        label: '尺寸',
        options: [
          { label: '大', value: 'large' },
          { label: '默认', value: 'default' },
          { label: '小', value: 'small' }
        ]
      },
      fit: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '自适应宽度',
        description: '列的宽度是否自撑开'
      },
      showHeader: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '显示表头',
        description: '是否显示表头'
      },
      highlightCurrentRow: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '高亮当前行',
        description: '是否高亮当前行'
      },
      maxHeight: {
        component: 'InputNumber',
        default: 0,
        type: 'Number',
        label: '最大高度',
        min: 0,
        placeholder: '0表示不限制',
        description: '表格的最大高度，超出后显示滚动条'
      },

      // === 特殊列配置 ===
      showSelection: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '显示选择列',
        description: '是否显示复选框列'
      },
      showIndex: {
        component: 'Switch',
        default: false,
        type: 'Boolean',
        label: '显示序号列',
        description: '是否显示序号列'
      },
      indexLabel: {
        component: 'Input',
        default: '序号',
        type: 'String',
        label: '序号列标题',
        placeholder: '序号列的显示文本'
      },

      // === 操作列配置 ===
      showActions: {
        component: 'Switch',
        default: true,
        type: 'Boolean',
        label: '显示操作列',
        description: '是否显示操作按钮列'
      },
      actionLabel: {
        component: 'Input',
        default: '操作',
        type: 'String',
        label: '操作列标题',
        placeholder: '操作列的显示文本'
      },
      actionWidth: {
        component: 'InputNumber',
        default: 120,
        type: 'Number',
        label: '操作列宽度',
        min: 80
      },
      actionFixed: {
        component: 'Select',
        default: 'right',
        type: 'String',
        label: '操作列固定',
        options: [
          { label: '右侧固定', value: 'right' },
          { label: '左侧固定', value: 'left' },
          { label: '不固定', value: '' }
        ]
      },

      // === 数据配置 ===
      data: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '静态数据',
        placeholder: 'JSON数组，用于预览',
        description: '表格的静态数据，用于预览或作为默认数据'
      },

      // === 样式配置 ===
      rowClassName: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '行类名',
        placeholder: '行的className函数名',
        description: '行的样式类名回调函数'
      },
      cellClassName: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '单元格类名',
        placeholder: '单元格的className函数名',
        description: '单元格的样式类名回调函数'
      },
      headerRowClassName: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '表头行类名',
        placeholder: '表头行的className函数名',
        description: '表头行的样式类名回调函数'
      },
      headerCellClassName: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '表头单元格类名',
        placeholder: '表头单元格的className函数名',
        description: '表头单元格的样式类名回调函数'
      },

      // === 高级属性 ===
      emptyText: {
        component: 'Input',
        default: '暂无数据',
        type: 'String',
        label: '空数据文本',
        placeholder: '当数据为空时显示的文本'
      },
      defaultSort: {
        component: 'Input',
        default: '',
        type: 'String',
        label: '默认排序',
        placeholder: 'JSON对象，例如：{"prop":"date","order":"descending"}',
        description: '默认的排序规则'
      },
      tooltipEffect: {
        component: 'Select',
        default: 'dark',
        type: 'String',
        label: '提示主题',
        options: [
          { label: '深色', value: 'dark' },
          { label: '浅色', value: 'light' }
        ]
      }
    },
    events: ['selection-change', 'sort-change', 'filter-change', 'edit', 'delete-row'],
    father: ['Row', 'Form', 'Block', 'Container'],
    slots: {
      default: '默认插槽',
      actions: '操作按钮',
      append: '插入至表格最后一行之后'
    },
    defaultOptions: {
      border: true,
      stripe: true,
      fit: true,
      showHeader: true,
      showActions: true,
      actionWidth: 120
    }
  }
]

// 获取表单项配置
export function getFormItemConfig(name: string): FormItemConfig | undefined {
  return FORM_ITEM_CONFIG.find((c) => c.name === name)
}

// 获取所有表单项名称
export function getFormItemNames(): string[] {
  return FORM_ITEM_CONFIG.map((c) => c.name)
}

// 获取表单项支持的事件
export function getFormItemEvents(name: string): string[] {
  const config = getFormItemConfig(name)
  return config?.events || []
}

// 获取表单项配置属性数量
export function getFormItemPropsCount(name: string): number {
  const config = getFormItemConfig(name)
  return config ? Object.keys(config.props).length : 0
}

// 获取所有组件的属性统计
export function getAllFormItemStats(): Array<{ name: string; label: string; propsCount: number }> {
  return FORM_ITEM_CONFIG.map((item) => ({
    name: item.name,
    label: item.label,
    propsCount: Object.keys(item.props).length
  }))
}
