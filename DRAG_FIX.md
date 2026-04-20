# 容器内拖放修复说明

## 修复内容

已修复往容器内拖放表单项不生效的问题：

### 1. 统一容器拖拽逻辑
- 创建了 `useContainerDrag` composable
- 所有容器组件使用统一的拖拽处理
- 确保事件正确向上传递

### 2. 修复的关键点

#### FormBuilder.vue
- ✅ 添加根容器拖拽支持
- ✅ 添加调试日志
- ✅ 修复 drop 事件处理

#### 所有容器组件
- ✅ 使用 `useContainerDrag` 统一处理
- ✅ 正确传递拖拽事件
- ✅ 阻止事件冒泡到错误的目标

#### DynamicFormItem.vue  
- ✅ 添加 `pointer-events` CSS
- ✅ 确保不阻止拖拽事件传播

### 3. 事件流向

```
左侧组件卡片拖拽开始
    ↓
onDragStart (Builder.vue)
    ↓
setDraggingNode (FormBuilder.vue)
    ↓
provide('dragState') 
    ↓
容器组件 inject('dragState')
    ↓
dragover → handleDragOver → emit('drag-over')
    ↓
drop → handleDrop → emit('drop')
    ↓
handleDrop (FormBuilder.vue)
    ↓
更新 Schema
```

## 测试步骤

### 1. 确保服务运行

```bash
# 后端
cd backend
npm run dev

# 前端
cd frontend
npm run dev
```

### 2. 打开浏览器

访问 http://localhost:3000

### 3. 测试拖拽

#### 测试 A：拖拽容器到画布
1. 点击"新增表单"
2. 从左侧拖拽 `Form` 组件
3. 拖到画布中间
4. 观察：
   - ✅ 画布显示蓝色高亮
   - ✅ 松开后 Form 容器添加成功
   - ✅ Form 容器显示粉色标签

#### 测试 B：拖拽表单项到 Form 容器
1. 确保画布上已有 Form 容器
2. 切换左侧到"表单项"标签
3. 拖拽 `Input` 组件
4. 拖到 Form 容器上方
5. 观察：
   - ✅ Form 容器边框变为绿色
   - ✅ 显示绿色插入线
   - ✅ 松开后 Input 添加成功

#### 测试 C：拖拽到 Row 容器
1. 先拖拽 `Form` 容器
2. 再拖拽 `Row` 容器到 Form 中
3. 最后拖拽 `Input` 到 Row 中
4. 观察：
   - ✅ 所有层级正确嵌套
   - ✅ 每个容器都有对应标签

## 调试方法

### 打开控制台
按 F12，切换到 Console 标签

### 预期日志
拖拽时应该看到：
```
handleDrop called: {targetNodeId: "xxx", index: -1, draggingNode: {...}}
Adding node: {...}
Added to container: "xxx", new children: [...]
```

### 检查 Schema
在控制台执行：
```javascript
// 获取 FormBuilder 实例
const app = document.querySelector('#app').__vue_app
console.log(app.config.globalProperties.$formBuilder)
```

## 常见问题

### Q1: 拖拽没反应
**检查：**
1. 后端是否运行（端口 3001）
2. 前端是否有编译错误
3. 浏览器控制台是否有错误

**解决：**
```bash
# 重启前端
cd frontend
# 按 Ctrl+C 停止
npm run dev
```

### Q2: 容器不高亮
**检查：**
1. 是否真的在拖拽（鼠标按下）
2. 容器是否在可放置位置

**解决：**
- 确保拖拽到容器上方
- 等待高亮出现再松手

### Q3: 松开后组件消失
**检查：**
1. 控制台是否有错误
2. Schema 是否正确更新

**解决：**
- 刷新页面重试
- 检查网络请求

## 文件清单

已修改的文件：
- ✅ `frontend/src/components/builder/FormBuilder.vue`
- ✅ `frontend/src/components/containers/BlockContainer.vue`
- ✅ `frontend/src/components/containers/FormContainer.vue`
- ✅ `frontend/src/components/containers/RowContainer.vue`
- ✅ `frontend/src/components/containers/ContainerContainer.vue`
- ✅ `frontend/src/components/form-items/DynamicFormItem.vue`
- ✅ `frontend/src/composables/useContainerDrag.ts` (新建)
- ✅ `frontend/src/composables/index.ts` (新建)

## 验证清单

完成以下测试确认修复成功：

- [ ] 可以拖拽容器到根节点
- [ ] 可以拖拽容器到容器中
- [ ] 可以拖拽表单项到容器中
- [ ] 拖拽时容器显示高亮
- [ ] 显示绿色插入线
- [ ] 松开后组件正确添加
- [ ] 可以点击组件进行选择
- [ ] 可以删除组件
- [ ] 可以配置组件属性
- [ ] 预览功能正常

## 下一步

如果测试通过，可以继续开发：
1. 完善属性配置面板
2. 实现事件绑定功能
3. 添加更多表单组件
4. 实现表单验证

如有问题，请查看 `DEBUG.md` 获取更多调试信息。
