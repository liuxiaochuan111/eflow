/**
 * 全局组件注册
 */

import { App } from 'vue'
import BlockContainer from './containers/BlockContainer.vue'
import ContainerContainer from './containers/ContainerContainer.vue'
import FormContainer from './containers/FormContainer.vue'
import RowContainer from './containers/RowContainer.vue'
import DynamicFormItem from './form-items/DynamicFormItem.vue'
import DynamicTable from './form-items/DynamicTable.vue'

export function registerComponents(app: App) {
  // 注册容器组件
  app.component('BlockContainer', BlockContainer)
  app.component('ContainerContainer', ContainerContainer)
  app.component('FormContainer', FormContainer)
  app.component('RowContainer', RowContainer)

  // 注册动态表单项组件
  app.component('DynamicInput', DynamicFormItem)
  app.component('DynamicInputNumber', DynamicFormItem)
  app.component('DynamicSelect', DynamicFormItem)
  app.component('DynamicDatePicker', DynamicFormItem)
  app.component('DynamicTimePicker', DynamicFormItem)
  app.component('DynamicRadio', DynamicFormItem)
  app.component('DynamicCheckbox', DynamicFormItem)
  app.component('DynamicSwitch', DynamicFormItem)
  app.component('DynamicSlider', DynamicFormItem)
  app.component('DynamicUpload', DynamicFormItem)
  app.component('DynamicCascader', DynamicFormItem)
  app.component('DynamicTextarea', DynamicFormItem)

  // 注册其他表单项组件 (暂用DynamicFormItem作为基础实现)
  app.component('DynamicRate', DynamicFormItem)
  app.component('DynamicColorPicker', DynamicFormItem)
  app.component('DynamicTransfer', DynamicFormItem)
  app.component('DynamicTreeSelect', DynamicFormItem)

  // 注册表格组件
  app.component('DynamicTable', DynamicTable)
}
