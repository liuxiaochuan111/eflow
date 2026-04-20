# 容器组件操作功能增强

## 优化概述

为所有容器组件（Block、Container、Form、Row）添加了配置和删除按钮，使其与表单项组件拥有相同的操作能力。

---

## 🎯 功能改进

### 1. 操作按钮添加
为每个容器组件的顶部标签栏添加了两个圆形按钮：
- 🔧 **配置按钮** (蓝色，Setting图标)
- 🗑️ **删除按钮** (红色，Delete图标)

### 2. 交互体验优化
- ✨ 按钮采用圆形设计 (24px × 24px)
- 🎨 悬停时显示标题提示
- 🛡️ 点击事件阻止冒泡 (`@click.stop`)
- 📍 图标大小统一为 12px

---

## 📦 各容器组件改进详情

### BlockContainer (块容器)

**改进前：**
```vue
<div class="container-label">Block</div>
```

**改进后：**
```vue
<div class="container-label">
  <el-icon><Box /></el-icon>
  <span>Block</span>
</div>
<div class="container-actions">
  <el-button type="primary" size="small" :icon="Setting" circle 
    @click.stop="handleNodeClick(schema)" title="配置" />
  <el-button type="danger" size="small" :icon="Delete" circle 
    @click.stop="handleNodeDelete(schema.id)" title="删除" />
</div>
```

**样式更新：**
- 标签栏高度: 24px → 32px
- 字体大小: 12px → 13px
- 字体粗细: normal → 600 (semi-bold)
- 新增 Box 图标显示
- 右侧操作按钮组

### ContainerContainer (通用容器)

**改进前：**
```vue
<div class="wrapper-badge">
  <el-icon><Box /></el-icon>
  <span>Container</span>
</div>
```

**改进后：**
```vue
<div class="wrapper-badge">
  <el-icon><Box /></el-icon>
  <span>Container</span>
</div>
<div class="wrapper-actions">
  <el-button type="primary" size="small" :icon="Setting" circle 
    @click.stop="handleNodeClick(schema)" title="配置" />
  <el-button type="danger" size="small" :icon="Delete" circle 
    @click.stop="handleNodeDelete(schema.id)" title="删除" />
</div>
```

**样式更新：**
- 标签栏内边距: 6px 12px → 8px 16px
- 字体粗细: 500 → 600
- 圆角: 6px → 8px
- 新增操作按钮组样式

### FormContainer (表单容器)

**改进前：**
```vue
<div class="container-badge">
  <el-icon><Document /></el-icon>
  <span>Form</span>
</div>
<div class="container-actions">
  <el-tag size="small" type="info">{{ options.labelPosition }}</el-tag>
</div>
```

**改进后：**
```vue
<div class="container-badge">
  <el-icon><Document /></el-icon>
  <span>Form</span>
</div>
<div class="container-meta">
  <el-tag size="small" type="info">{{ options.labelPosition }}</el-tag>
</div>
<div class="container-actions">
  <el-button type="primary" size="small" :icon="Setting" circle 
    @click.stop="handleNodeClick(schema)" title="配置" />
  <el-button type="danger" size="small" :icon="Delete" circle 
    @click.stop="handleNodeDelete(schema.id)" title="删除" />
</div>
```

**样式更新：**
- 标签栏布局优化为三栏结构
- 新增 `container-meta` 中间区域
- 右侧操作按钮组独立
- 增加间距 (gap: 12px)

### RowContainer (行容器)

**改进前：**
```vue
<div class="row-badge">
  <el-icon><Grid /></el-icon>
  <span>Row ({{ options.gutter || 0 }}px)</span>
</div>
```

**改进后：**
```vue
<div class="row-badge">
  <el-icon><Grid /></el-icon>
  <span>Row ({{ options.gutter || 0 }}px)</span>
</div>
<div class="row-actions">
  <el-button type="primary" size="small" :icon="Setting" circle 
    @click.stop="handleNodeClick(schema)" title="配置" />
  <el-button type="danger" size="small" :icon="Delete" circle 
    @click.stop="handleNodeDelete(schema.id)" title="删除" />
</div>
```

**样式更新：**
- 标签栏内边距: 6px 12px → 8px 16px
- 字体粗细: 500 → 600
- 圆角: 6px → 8px
- 新增操作按钮组

---

## 🎨 统一样式规范

### 操作按钮样式
```css
.container-actions,
.wrapper-actions,
.row-actions {
  display: flex;
  gap: 8px;
}

.container-actions .el-button,
.wrapper-actions .el-button,
.row-actions .el-button {
  width: 24px;
  height: 24px;
  padding: 0;
}

.container-actions .el-button :deep(.el-icon),
.wrapper-actions .el-button :deep(.el-icon),
.row-actions .el-button :deep(.el-icon) {
  font-size: 12px;
}
```

### 标签栏优化
- **高度**: 统一为 32px (BlockContainer) 或自适应
- **内边距**: 8px 16px (增加空间感)
- **圆角**: 8px (更现代化)
- **字体粗细**: 600 (semi-bold)
- **字体大小**: 13-14px
- **图标尺寸**: 16px (标签图标) / 12px (按钮图标)

---

## ⚡ 事件处理

### 配置按钮点击
```typescript
@click.stop="handleNodeClick(schema)"
```
- 触发 `node-click` 事件
- 传递当前容器 schema 对象
- 阻止事件冒泡，避免触发父级点击

### 删除按钮点击
```typescript
@click.stop="handleNodeDelete(schema.id)"
```
- 触发 `node-delete` 事件
- 传递容器 ID
- 阻止事件冒泡
- 删除整个容器及其子节点

---

## 🔧 图标导入

所有容器组件新增图标导入：
```typescript
import { Setting, Delete } from '@element-plus/icons-vue'
```

---

## 📋 功能对比

### 改进前
| 组件 | 配置功能 | 删除功能 | 用户反馈 |
|------|---------|---------|---------|
| Block | ❌ | ❌ | 无法直接操作 |
| Container | ❌ | ❌ | 无法直接操作 |
| Form | ❌ | ❌ | 无法直接操作 |
| Row | ❌ | ❌ | 无法直接操作 |

### 改进后
| 组件 | 配置功能 | 删除功能 | 用户反馈 |
|------|---------|---------|---------|
| Block | ✅ | ✅ | 即时可操作 |
| Container | ✅ | ✅ | 即时可操作 |
| Form | ✅ | ✅ | 即时可操作 |
| Row | ✅ | ✅ | 即时可操作 |

---

## 🎯 使用体验提升

### 1. 一致性
- ✅ 容器组件与表单项组件操作方式统一
- ✅ 所有组件都有配置和删除入口
- ✅ 按钮样式和位置保持一致

### 2. 可发现性
- ✅ 按钮位置明显（右上角）
- ✅ 悬停提示清晰
- ✅ 图标语义明确

### 3. 操作效率
- ✅ 无需选中间接操作
- ✅ 直接点击即可配置/删除
- ✅ 减少操作步骤

### 4. 视觉反馈
- ✅ 按钮尺寸适中，易于点击
- ✅ 颜色区分功能类型（蓝=配置，红=删除）
- ✅ 圆形设计更现代化

---

## 🛠️ 技术实现要点

### 1. 事件冒泡控制
```vue
@click.stop="handleNodeClick(schema)"
```
防止点击按钮时触发容器的点击事件，避免误操作。

### 2. 响应式布局
使用 `display: flex` 和 `justify-content: space-between` 确保按钮始终在右侧。

### 3. 条件渲染
```vue
v-if="isBuild"
```
操作按钮仅在构建模式下显示，使用模式下不显示，保持界面整洁。

### 4. 图标组件化
```vue
<el-icon :icon="Setting" />
```
使用 Element Plus 的图标组件，支持动态切换和主题。

---

## ✅ 完成状态

- ✅ BlockContainer - 配置/删除按钮已添加
- ✅ ContainerContainer - 配置/删除按钮已添加
- ✅ FormContainer - 配置/删除按钮已添加
- ✅ RowContainer - 配置/删除按钮已添加
- ✅ 样式统一规范已完成
- ✅ 事件处理逻辑已验证

---

生成时间: 2026-04-20
改进范围: 所有容器组件 (4个)
新增功能: 配置按钮 + 删除按钮
技术栈: Vue 3 + Element Plus + TypeScript
