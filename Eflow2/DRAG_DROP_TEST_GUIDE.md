# 拖拽输入框到Row容器 - 测试和调试指南

## 🔍 如何测试和调试

### 方法1: 打开浏览器控制台
1. 运行 `npm run dev` 启动开发服务器
2. 打开浏览器到 http://localhost:3003
3. 按F12打开开发者工具
4. 切换到Console标签

### 方法2: 执行拖拽操作
1. 从左侧面板拖拽"输入框"组件
2. 拖到中间的Row容器中（有三种方式）
3. 观察控制台输出

### 3. 拖拽的三种方式
当拖拽Input到Row时，可以：

#### 方式1：拖到空的Row
- 适用于Row还没有子节点的情况
- 拖到Row显示的"拖拽表单组件到行"区域

#### 方式2：拖到已有子节点的Row
- 适用于Row已经有子节点的情况
- 直接拖到Row的任何子节点上
- FormItem会自动传递事件给父节点Row

#### 方式3：拖到Row底部的"+"区域
- 适用于Row已经有子节点的情况
- 拖到Row底部40px高度的"+"区域
- 这个区域在拖拽时会扩大到60px，更容易命中

## 📊 预期的控制台输出

### 场景1：拖到空的Row
```
CanvasNode handleDragEnter: Row dragging: Input
CanvasNode handleDragOver: Row dragging: Input
CanvasNode handleDrop: Row targetIndex: null
EditorPage handleNodeDrop called
Dragging item: Input to target: Row
Item def: {type: 'Input', father: ['Row'], ...}
Target def: {type: 'Row', ...}
Form component validation
Item father: ['Row']
Target type: Row
Includes? true
Validation passed, creating node
```

### 场景2：拖到已有子节点的Row
```
CanvasNode handleDragEnter: FormItem dragging: Input
CanvasNode handleDragOver: FormItem dragging: Input
CanvasNode handleDrop: FormItem targetIndex: null
CanvasNode handleDrop: Node cannot accept drop, passing to parent
CanvasNode handleChildDrop: Parent can accept drop: Row index: 1
EditorPage handleNodeDrop called
Dragging item: Input to target: Row
...
Validation passed, creating node
```

### 场景3：拖到"+"区域
```
CanvasNode handleDragEnter: Row dragging: Input
CanvasNode handleDragOver: Row dragging: Input
CanvasNode handleDrop: Row targetIndex: 2
EditorPage handleNodeDrop called
Dragging item: Input to target: Row
...
Validation passed, creating node
```

## 🐛 可能的问题和解决方案

### 问题1: 事件没有触发
**症状**: 控制台没有任何输出

**解决方案**:
- 确保拖拽到Row容器（绿色边框的容器）
- Row应该显示为"Row 行"标签
- 不要拖到Block或Container上

### 问题2: 提示不能放置在Block中
**症状**: 错误提示"Input 只能放置在 Row 中，不能放置在 Block 中"

**解决方案**:
- 这个问题已经修复！
- 如果仍然出现，请刷新页面重试
- 确保拖拽到Row而不是Block

### 问题3: 没有绿色高亮
**症状**: 拖拽时没有视觉反馈

**解决方案**:
- 确保拖拽的是Input组件（输入框）
- 确保目标容器是Row（行）
- 检查控制台是否有错误

## ✅ 验证成功的标志

1. ✅ 控制台显示完整的事件日志
2. ✅ 看到绿色高亮和动画效果
3. ✅ 松开鼠标后Input自动包装成FormItem
4. ✅ FormItem显示在Row中
5. ✅ 右侧面板显示两部分属性

## 🎯 快速测试步骤

1. 启动开发服务器
2. 打开浏览器控制台
3. 拖拽Block到画布
4. 拖拽Input到Block中的Row（三种方式任选）
5. 检查控制台输出
6. 确认FormItem自动创建并显示在Row中

## 🎨 视觉提示

- ✅ **绿色边框**：可以放置的容器显示绿色边框
- ✅ **绿色背景**：容器背景变为浅绿色
- ✅ **"+"区域**：Row底部有40px的"+"区域
- ✅ **脉冲动画**：拖拽时容器有脉冲效果
- ✅ **扩大效果**：拖拽到"+"区域时，区域从40px扩大到60px

测试愉快！🎉
