import type { ComponentConfig } from '../types'

// Import all component setters
import FormItemSetters from './form/FormItem'
import BlockSetters from './container/Block'
import ContainerSetters from './container/Container'
import TabSetters from './container/Tab'
import TabItemSetters from './container/TabItem'
import RowSetters from './container/Row'
import InputSetters from './form/Input'
import SelectSetters from './form/Select'
import SwitchSetters from './form/Switch'
import DatePickerSetters from './form/DatePicker'
import TimePickerSetters from './form/TimePicker'
import InputNumberSetters from './form/InputNumber'

// Component definitions registry
const componentSetters: Record<string, ComponentConfig> = {
  FormItem: FormItemSetters,
  Block: BlockSetters,
  Container: ContainerSetters,
  Tab: TabSetters,
  TabItem: TabItemSetters,
  Row: RowSetters,
  Input: InputSetters,
  Select: SelectSetters,
  Switch: SwitchSetters,
  DatePicker: DatePickerSetters,
  TimePicker: TimePickerSetters,
  InputNumber: InputNumberSetters
}

// Get component setters by type
export function getComponentSetters(type: string): ComponentConfig | null {
  return componentSetters[type] || null
}

// Get all container types
export function getContainerTypes(): ComponentConfig[] {
  return [
    BlockSetters,
    ContainerSetters,
    TabSetters,
    TabItemSetters,
    RowSetters
  ]
}

// Get all form component types
export function getFormComponentTypes(): ComponentConfig[] {
  return [
    FormItemSetters,
    InputSetters,
    SelectSetters,
    SwitchSetters,
    DatePickerSetters,
    TimePickerSetters,
    InputNumberSetters
  ]
}

// Get all component types
export function getAllComponentTypes(): ComponentConfig[] {
  return Object.values(componentSetters)
}
