/**
 * Validator 工具函数单元测试
 */

import { describe, it, expect } from 'vitest'
import { validateValue, commonPatterns } from '@/utils/validator'
import type { ValidationRule } from '@/utils/validator'

describe('Validator', () => {
  describe('validateValue', () => {
    it('应该通过空值验证 - 非必填', () => {
      const rules: ValidationRule[] = []
      const result = validateValue('', rules)
      
      expect(result.valid).toBe(true)
    })

    it('应该失败 - 必填项为空', () => {
      const rules: ValidationRule[] = [{ required: true }]
      const result = validateValue('', rules)
      
      expect(result.valid).toBe(false)
      expect(result.message).toBeDefined()
    })

    it('应该通过 - 必填项有值', () => {
      const rules: ValidationRule[] = [{ required: true }]
      const result = validateValue('test', rules)
      
      expect(result.valid).toBe(true)
    })

    it('应该通过 - 正则验证', () => {
      const rules: ValidationRule[] = [
        { pattern: /^[a-zA-Z0-9]+$/, message: '只能包含字母和数字' }
      ]
      const result = validateValue('test123', rules)
      
      expect(result.valid).toBe(true)
    })

    it('应该失败 - 正则验证不匹配', () => {
      const rules: ValidationRule[] = [
        { pattern: /^[a-zA-Z0-9]+$/, message: '只能包含字母和数字' }
      ]
      const result = validateValue('test@123', rules)
      
      expect(result.valid).toBe(false)
      expect(result.message).toBe('只能包含字母和数字')
    })

    it('应该通过 - 最小长度验证', () => {
      const rules: ValidationRule[] = [{ min: 3 }]
      const result = validateValue('test', rules)
      
      expect(result.valid).toBe(true)
    })

    it('应该失败 - 小于最小长度', () => {
      const rules: ValidationRule[] = [{ min: 5 }]
      const result = validateValue('test', rules)
      
      expect(result.valid).toBe(false)
      expect(result.message).toContain('5')
    })

    it('应该通过 - 最大长度验证', () => {
      const rules: ValidationRule[] = [{ max: 10 }]
      const result = validateValue('test', rules)
      
      expect(result.valid).toBe(true)
    })

    it('应该失败 - 超过最大长度', () => {
      const rules: ValidationRule[] = [{ max: 5 }]
      const result = validateValue('toolongtext', rules)
      
      expect(result.valid).toBe(false)
    })

    it('应该支持自定义验证器', () => {
      const customValidator = (value: any) => {
        return value === 'valid'
      }
      const rules: ValidationRule[] = [{ validator: customValidator }]
      
      const result1 = validateValue('valid', rules)
      expect(result1.valid).toBe(true)
      
      const result2 = validateValue('invalid', rules)
      expect(result2.valid).toBe(false)
    })

    it('应该支持自定义验证器返回字符串错误消息', () => {
      const customValidator = (value: any) => {
        if (value !== 'specific') {
          return '必须是specific值'
        }
        return true
      }
      const rules: ValidationRule[] = [{ validator: customValidator }]
      
      const result = validateValue('other', rules)
      expect(result.valid).toBe(false)
      expect(result.message).toBe('必须是specific值')
    })

    it('应该验证多个规则', () => {
      const rules: ValidationRule[] = [
        { required: true, message: '必填' },
        { min: 3, message: '太短' },
        { max: 10, message: '太长' },
        { pattern: /^[a-z]+$/, message: '只能小写字母' }
      ]
      
      const result1 = validateValue('', rules)
      expect(result1.valid).toBe(false)
      expect(result1.message).toBe('必填')
      
      const result2 = validateValue('ab', rules)
      expect(result2.valid).toBe(false)
      expect(result2.message).toBe('太短')
      
      const result3 = validateValue('verylongstring', rules)
      expect(result3.valid).toBe(false)
      expect(result3.message).toBe('太长')
      
      const result4 = validateValue('Valid123', rules)
      expect(result4.valid).toBe(false)
      expect(result4.message).toBe('只能小写字母')
      
      const result5 = validateValue('valid', rules)
      expect(result5.valid).toBe(true)
    })
  })

  describe('commonPatterns', () => {
    it('email pattern应该验证有效邮箱', () => {
      expect(commonPatterns.email.test('test@example.com')).toBe(true)
      expect(commonPatterns.email.test('user.name+tag@domain.co.uk')).toBe(true)
      expect(commonPatterns.email.test('invalid')).toBe(false)
      expect(commonPatterns.email.test('@example.com')).toBe(false)
      expect(commonPatterns.email.test('test@')).toBe(false)
    })

    it('phone pattern应该验证中国手机号', () => {
      expect(commonPatterns.phone.test('13812345678')).toBe(true)
      expect(commonPatterns.phone.test('15998765432')).toBe(true)
      expect(commonPatterns.phone.test('12345678901')).toBe(false) // 1开头的第二位不对
      expect(commonPatterns.phone.test('1381234567')).toBe(false) // 位数不够
    })

    it('idCard pattern应该验证身份证号', () => {
      expect(commonPatterns.idCard.test('110101199001011234')).toBe(true)
      expect(commonPatterns.idCard.test('11010119900101123X')).toBe(true)
      expect(commonPatterns.idCard.test('12345')).toBe(false)
    })

    it('url pattern应该验证URL', () => {
      expect(commonPatterns.url.test('https://example.com')).toBe(true)
      expect(commonPatterns.url.test('http://example.com')).toBe(true)
      expect(commonPatterns.url.test('ftp://example.com')).toBe(false)
      expect(commonPatterns.url.test('example.com')).toBe(false)
    })
  })
})
