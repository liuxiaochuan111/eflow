# EFlow - 可视化表单编排系统

> 通过拖拽组件的方式快速配置表单片段

## 项目简介

EFlow 是一个功能强大的可视化表单编排系统，支持通过拖拽组件的方式快速构建表单。系统包含表单清单管理、可视化编排界面以及一个可复用的表单构建组件。

## 功能特性

- **拖拽式编排** - 直观的拖拽界面，快速构建表单
  - 实时视觉反馈：拖拽时目标容器高亮显示
  - 精确位置提示：绿色插入线指示放置位置
  - 美观的组件卡片：渐变色图标和详细信息
  - 智能容器检测：自动判断可放置的容器类型
- **丰富的组件库** - 支持 12+ 常用表单组件
- **事件联动** - 支持组件间的事件联动和数据绑定
- **属性配置** - 灵活的属性配置面板
- **预览功能** - 实时预览表单效果
- **多尺寸预览** - 支持 PC、平板、手机等多端预览
- **可复用组件** - FormBuilder 组件可在任何场景使用

## 技术栈

### 前端
- Vue 3 - 渐进式 JavaScript 框架
- Element Plus - Vue 3 组件库
- TypeScript - JavaScript 超集
- Vite - 下一代前端构建工具
- Vue Router - 路由管理
- Pinia - 状态管理
- VueUse - Vue 组合式工具集
- vuedraggable - 拖拽组件

### 后端
- Node.js - JavaScript 运行环境
- Express - Web 应用框架
- TypeScript - JavaScript 超集

## 项目结构

```
eflow/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── composables/  # 组合式函数
│   │   ├── configs/      # 配置清单
│   │   ├── types/        # 类型定义
│   │   ├── utils/        # 工具函数
│   │   ├── views/        # 页面
│   │   ├── api/          # API 接口
│   │   └── router/       # 路由配置
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # 后端项目
│   ├── src/
│   │   ├── routes/      # 路由
│   │   ├── controllers/ # 控制器
│   │   ├── models/      # 数据模型
│   │   └── mock/        # Mock 数据
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                 # 文档
├── README.md
└── 指令.txt
```

## 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x 或 pnpm >= 7.x

### 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 启动项目

```bash
# 启动后端服务 (端口 3001)
cd backend
npm run dev

# 启动前端服务 (端口 3000)
cd frontend
npm run dev
```

**💡 提示**: 详细的启动步骤请查看 [快速启动指南](./QUICKSTART.md)

### 访问应用

打开浏览器访问: http://localhost:3000

## 拖拽功能说明

### 组件卡片

左侧面板的组件卡片设计：

- **渐变色图标** - 每个组件都有独特的渐变色背景
- **悬停效果** - 鼠标悬停时卡片上浮并显示阴影
- **拖拽状态** - 拖拽时光标变为抓取状态

### 拖拽反馈

- **蓝色高亮** - 当拖拽组件经过可放置的容器时，容器显示蓝色边框和背景
- **绿色插入线** - 在容器中显示脉冲动画的绿色线条，指示组件将插入的位置
- **顶部工具栏提示** - 拖拽时显示当前正在拖拽的组件名称

### 容器标签

每个容器在编排模式下都显示顶部标签：

- **Block** - 紫色渐变
- **Container** - 粉色渐变
- **Form** - 蓝色渐变，显示标签位置信息
- **Row** - 青色渐变，显示栅格间距信息

## 使用说明

### 1. 创建表单

- 访问表单清单页面
- 点击"新增表单"按钮
- 进入编排界面

### 2. 编排表单

- 从左侧面板拖拽容器或表单项到中间画布
- 点击组件可在右侧配置属性和事件
- 使用工具栏预览、保存、重置表单

### 3. 配置属性

- 选择组件后，在右侧"属性"面板配置
- 支持配置组件的各种属性

### 4. 绑定事件

- 选择表单项后，在右侧"事件"面板配置
- 支持多种事件联动：
  - 设置属性
  - 显示/隐藏
  - 启用/禁用
  - 执行函数
  - 数据映射

### 5. 预览与保存

- 点击"预览"按钮查看表单效果
- 点击"保存"按钮保存表单配置

## FormBuilder 组件使用

```vue
<template>
  <FormBuilder
    v-model="formData"
    :schema="formSchema"
    :event-config="eventConfig"
    :is-build="false"
    :custom-funcs="customFuncs"
    :state="appState"
    @render-end="handleRenderEnd"
  />
</template>

<script setup>
import { ref } from 'vue'
import FormBuilder from '@/components/builder/FormBuilder.vue'

const formData = ref({})
const formSchema = ref({
  type: 'Container',
  component: 'Container',
  display: true,
  options: {},
  children: []
})
const eventConfig = ref({})
const customFuncs = {
  handleSubmit: () => {
    console.log('提交表单')
  }
}
const appState = ref({
  user: { name: 'John' }
})

const handleRenderEnd = () => {
  console.log('表单渲染完成')
}
</script>
```

## 支持的组件

### 容器组件
- Block - 区块容器
- Container - 通用容器
- Form - 表单容器
- Row - 栅格容器

### 表单项组件
- Input - 输入框
- InputNumber - 数字输入框
- Select - 选择器
- DatePicker - 日期选择器
- TimePicker - 时间选择器
- Radio - 单选框
- Checkbox - 复选框
- Switch - 开关
- Slider - 滑块
- Upload - 上传
- Cascader - 级联选择器
- Textarea - 文本域

## 开发指南

### 添加新组件

1. 在 `configs/form-items.ts` 添加组件配置
2. 在 `types/config.ts` 添加类型定义
3. 创建对应的渲染组件

### 添加新事件

1. 在 `configs/event-actions.ts` 添加事件动作配置
2. 在 `composables/useEventBinding.ts` 实现事件逻辑

## 测试

```bash
# 运行单元测试
cd frontend
npm test

cd backend
npm test
```

## 构建

```bash
# 构建前端
cd frontend
npm run build

# 构建后端
cd backend
npm run build
```

## 文档

- [使用指南](./docs/使用指南.md)
- [API 文档](./docs/API文档.md)

## License

MIT

## 作者

EFlow Team

---

**注意**: 本项目仍在持续开发中，欢迎提出建议和反馈。
