import { describe, expect, it } from 'vitest'

import { ValidationError } from '../types'
import { Phone } from './phone'

describe('Phone', () => {
  describe('constructor', () => {
    it('should create a valid landline phone when given a valid number', () => {
      const validPhone = '1133334444'
      const phone = new Phone(validPhone)

      expect(phone.value).toBe(validPhone)
      expect(phone.rawValue).toBe(validPhone)
      expect(phone.formattedValue).toBe('(11) 3333-4444')
      expect(phone.areaCode).toBe('11')
      expect(phone.number).toBe('33334444')
      expect(phone.isLandline).toBe(true)
      expect(phone.isMobile).toBe(false)
    })

    it('should create a valid mobile phone when given a valid number', () => {
      const validPhone = '11987654321'
      const phone = new Phone(validPhone)

      expect(phone.value).toBe(validPhone)
      expect(phone.rawValue).toBe(validPhone)
      expect(phone.formattedValue).toBe('(11) 98765-4321')
      expect(phone.areaCode).toBe('11')
      expect(phone.number).toBe('987654321')
      expect(phone.isLandline).toBe(false)
      expect(phone.isMobile).toBe(true)
    })

    it('should create a valid phone when given a formatted number', () => {
      const formattedPhone = '(11) 3333-4444'
      const phone = new Phone(formattedPhone)

      expect(phone.rawValue).toBe('1133334444')
      expect(phone.formattedValue).toBe('(11) 3333-4444')
    })

    it('should throw ValidationError when phone has invalid length', () => {
      expect(() => new Phone('123456789')).toThrow(ValidationError)
      expect(() => new Phone('123456789012')).toThrow(ValidationError)
    })

    it('should throw ValidationError when area code is invalid', () => {
      expect(() => new Phone('1033334444')).toThrow(ValidationError) // DDD < 11
      expect(() => new Phone('10033334444')).toThrow(ValidationError) // DDD > 99
    })

    it('should throw ValidationError when mobile phone does not start with 9', () => {
      expect(() => new Phone('11876543210')).toThrow(ValidationError)
    })

    it('should throw ValidationError when phone has all digits equal', () => {
      expect(() => new Phone('1111111111')).toThrow(ValidationError)
      expect(() => new Phone('11111111111')).toThrow(ValidationError)
    })

    it('should throw ValidationError when phone is not a string', () => {
      expect(() => new Phone(null as unknown as string)).toThrow(ValidationError)
      expect(() => new Phone(undefined as unknown as string)).toThrow(ValidationError)
      expect(() => new Phone(123 as unknown as string)).toThrow(ValidationError)
    })
  })

  describe('static methods', () => {
    it('should create phone using create method', () => {
      const phone = Phone.create('1133334444')
      expect(phone.value).toBe('1133334444')
    })

    it('should validate phone using isValid method', () => {
      expect(Phone.isValid('1133334444')).toBe(true)
      expect(Phone.isValid('11987654321')).toBe(true)
      expect(Phone.isValid('(11) 3333-4444')).toBe(true)
      expect(Phone.isValid('123456789')).toBe(false)
      expect(Phone.isValid('1033334444')).toBe(false)
    })
  })

  describe('equality', () => {
    it('should be equal when phones have same value', () => {
      const phone1 = new Phone('1133334444')
      const phone2 = new Phone('1133334444')

      expect(phone1.equals(phone2)).toBe(true)
      expect(phone1.hashCode()).toBe(phone2.hashCode())
    })

    it('should be equal when phones have same value but different format', () => {
      const phone1 = new Phone('1133334444')
      const phone2 = new Phone('(11) 3333-4444')

      expect(phone1.equals(phone2)).toBe(true)
    })

    it('should not be equal when phones have different values', () => {
      const phone1 = new Phone('1133334444')
      const phone2 = new Phone('1144445555')

      expect(phone1.equals(phone2)).toBe(false)
    })
  })

  describe('clone', () => {
    it('should create a copy of the phone', () => {
      const originalPhone = new Phone('1133334444')
      const clonedPhone = originalPhone.clone()

      expect(clonedPhone.equals(originalPhone)).toBe(true)
      expect(clonedPhone).not.toBe(originalPhone)
    })
  })

  describe('toString', () => {
    it('should return formatted phone', () => {
      const phone = new Phone('1133334444')
      expect(phone.toString()).toBe('(11) 3333-4444')
    })
  })

  describe('phone type detection', () => {
    it('should correctly identify landline phones', () => {
      const landlinePhone = new Phone('1133334444')
      expect(landlinePhone.isLandline).toBe(true)
      expect(landlinePhone.isMobile).toBe(false)
    })

    it('should correctly identify mobile phones', () => {
      const mobilePhone = new Phone('11987654321')
      expect(mobilePhone.isLandline).toBe(false)
      expect(mobilePhone.isMobile).toBe(true)
    })
  })

  describe('area code validation', () => {
    it('should accept valid area codes', () => {
      expect(() => new Phone('1133334444')).not.toThrow() // São Paulo
      expect(() => new Phone('2133334444')).not.toThrow() // Rio de Janeiro
      expect(() => new Phone('8533334444')).not.toThrow() // Ceará
      expect(() => new Phone('9933334444')).not.toThrow() // Amazonas
    })

    it('should reject invalid area codes', () => {
      expect(() => new Phone('1033334444')).toThrow(ValidationError) // < 11
      expect(() => new Phone('10033334444')).toThrow(ValidationError) // > 99
    })
  })

  describe('edge cases', () => {
    it('should handle phone with minimum valid area code', () => {
      const phone = new Phone('1133334444')
      expect(phone.areaCode).toBe('11')
    })

    it('should handle phone with maximum valid area code', () => {
      const phone = new Phone('9933334444')
      expect(phone.areaCode).toBe('99')
    })

    it('should handle phone with leading zeros in area code', () => {
      const phone = new Phone('1133334444')
      expect(phone.areaCode).toBe('11')
    })
  })
})
