# 拖拽功能调试指南

## 问题：往容器内拖放表单项不生效

### 调试步骤

#### 1. 打开浏览器开发者工具
- 按 F12 打开开发者工具
- 切换到 "Console" 标签

#### 2. 清空控制台
- 点击控制台左上角的清空按钮 🚫

#### 3. 测试拖拽
1. 从左侧拖拽一个容器（如 Form）到画布
2. 观察控制台输出
3. 再拖拽一个表单项（如 Input）到 Form 容器中
4. 观察控制台输出

### 预期输出

拖拽容器时：
```
handleDrop called: {targetNodeId: "root_xxx", index: -1, draggingNode: {...}}
Adding node: {type: "Container", component: "Form", ...}
Added to root, new children: [...]
```

拖拽表单项到容器时：
```
handleDrop called: {targetNodeId: "form_xxx", index: -1, draggingNode: {...}}
Adding node: {type: "FormItem", component: "Input", ...}
Added to container: "form_xxx", new children: [...]
```

### 常见问题

#### 问题1：拖拽没有任何反应

**可能原因：**
- 后端服务未启动
- 前端编译错误
- 浏览器缓存

**解决方法：**
1. 检查后端是否运行（http://localhost:3001）
2. 检查前端是否有编译错误
3. 硬刷新页面（Ctrl + Shift + R）

#### 问题2：拖拽到容器没有高亮

**可能原因：**
- 容器组件事件未正确传递
- 拖拽状态未正确共享

**解决方法：**
1. 检查控制台是否有错误
2. 检查容器组件是否正确使用 inject 获取拖拽状态

#### 问题3：拖拽后组件消失

**可能原因：**
- Schema 更新未触发重新渲染
- children 属性未正确初始化

**解决方法：**
1. 检查 Schema 结构是否正确
2. 确认 children 数组已创建

### 手动验证

在浏览器控制台中执行：

```javascript
// 检查 FormBuilder 实例
const builder = document.querySelector('.form-builder')?.__vueParentComponent
console.log('FormBuilder:', builder)

// 检查当前 Schema
console.log('Current Schema:', builder?.schema)

// 检查拖拽状态
console.log('Drag State:', builder?.draggingNode)
```

### 修复检查清单

- [x] FormBuilder 添加根容器拖拽支持
- [x] 所有容器组件事件正确传递
- [x] DynamicFormItem 不阻止拖拽事件
- [x] 添加调试日志
- [x] 容器 children 数组初始化

### 测试用例

1. **测试1：拖拽容器到根节点**
   - 从左侧拖拽 Block 组件
   - 预期：成功添加到画布

2. **测试2：拖拽容器到容器**
   - 先拖拽 Form 容器
   - 再拖拽 Row 容器到 Form 中
   - 预期：Row 成功添加到 Form 中

3. **测试3：拖拽表单项到容器**
   - 拖拽 Form 容器
   - 拖拽 Input 表单项到 Form 中
   - 预期：Input 成功添加到 Form 中

4. **测试4：拖拽表单项到 Row**
   - 拖拽 Row 容器
   - 拖拽 Input 表单项到 Row 中
   - 预期：Input 成功添加到 Row 中

### 如果问题仍然存在

1. 检查网络请求是否正常
2. 查看完整的错误堆栈
3. 尝试重启开发服务器
4. 清除 node_modules 重新安装

```bash
# 清除并重新安装
cd frontend
rm -rf node_modules
npm install

cd ../backend
rm -rf node_modules
npm install
```
