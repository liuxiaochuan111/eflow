/**
 * 表单校验器
 */

export interface ValidationRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  validator?: (value: any) => boolean | string | Promise<boolean | string>
}

export interface ValidationResult {
  valid: boolean
  message?: string
}

/**
 * 校验单个值
 */
export function validateValue(value: any, rules: ValidationRule[]): ValidationResult {
  for (const rule of rules) {
    // 必填校验
    if (rule.required && (value === undefined || value === null || value === '')) {
      return {
        valid: false,
        message: rule.message || '该字段为必填项'
      }
    }

    // 正则校验
    if (rule.pattern && value && !rule.pattern.test(value)) {
      return {
        valid: false,
        message: rule.message || '格式不正确'
      }
    }

    // 最小值/长度
    if (rule.min !== undefined && value && value.length < rule.min) {
      return {
        valid: false,
        message: rule.message || `不能小于${rule.min}`
      }
    }

    // 最大值/长度
    if (rule.max !== undefined && value && value.length > rule.max) {
      return {
        valid: false,
        message: rule.message || `不能大于${rule.max}`
      }
    }

    // 自定义校验器
    if (rule.validator) {
      const result = rule.validator(value)
      if (result === false || typeof result === 'string') {
        return {
          valid: false,
          message: typeof result === 'string' ? result : rule.message
        }
      }
    }
  }

  return { valid: true }
}

/**
 * 常用正则表达式
 */
export const commonPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^1[3-9]\d{9}$/,
  idCard: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
  url: /^https?:\/\/.+/
}
