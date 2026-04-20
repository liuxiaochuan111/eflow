# EFlow Backend Server

EFlow 表单编排系统的后端 API 服务。

## 技术栈

- Node.js + Express
- TypeScript
- 内存存储（后期可扩展为数据库）

## 功能特性

- ✅ 表单 CRUD 操作
- ✅ Schema 树结构存储
- ✅ 事件配置存储
- ✅ RESTful API
- ✅ CORS 支持

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

服务器将在 http://localhost:3001 启动

### 生产模式

```bash
npm run build
npm start
```

## API 接口

### 获取表单列表

```
GET /api/forms
```

响应示例：
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "xxx",
      "name": "示例表单",
      "schema": { ... },
      "eventConfig": { ... },
      "createdAt": "2024-04-20T00:00:00.000Z",
      "updatedAt": "2024-04-20T00:00:00.000Z"
    }
  ]
}
```

### 获取表单详情

```
GET /api/forms/:id
```

### 创建表单

```
POST /api/forms
Content-Type: application/json

{
  "name": "新表单",
  "schema": { ... },
  "eventConfig": { ... }
}
```

### 更新表单

```
PUT /api/forms/:id
Content-Type: application/json

{
  "name": "更新后的表单",
  "schema": { ... },
  "eventConfig": { ... }
}
```

### 删除表单

```
DELETE /api/forms/:id
```

## 数据结构

### SchemaNode

```typescript
interface SchemaNode {
  id: string
  type: 'Container' | 'FormItem'
  component: string
  display: boolean
  options: Record<string, any>
  model?: string
  label?: string
  required?: boolean
  children?: SchemaNode[]
}
```

### EventConfig

```typescript
interface EventConfig {
  [model: string]: {
    [eventName: string]: EventAction[]
  }
}

interface EventAction {
  target: string
  method: 'set' | 'call' | 'map'
  props: Record<string, any>
}
```

## 开发说明

当前使用内存存储数据，服务器重启后数据会丢失。

如需持久化存储，可以：
1. 集成数据库（MongoDB、PostgreSQL、MySQL）
2. 使用文件系统存储
3. 使用 Redis 等缓存系统

## 许可证

MIT
