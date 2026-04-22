import components from '../../components.js'

// 注册所有组件
export function registerAllComponents(app) {
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component)
  })
}

// 导出所有组件
export default components
