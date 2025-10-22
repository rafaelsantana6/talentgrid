import { describe, expect, it } from 'vitest'

import { ValidationError } from '../types'
import { Rg } from './rg'

describe('Rg', () => {
  describe('constructor', () => {
    it('should create a valid RG when given a valid number', () => {
      const validRg = '123456789'
      const rg = new Rg(validRg)

      expect(rg.value).toBe(validRg)
      expect(rg.rawValue).toBe(validRg)
      expect(rg.formattedValue).toBe('12.345.678-9')
    })

    it('should create a valid RG when given a formatted number', () => {
      const formattedRg = '12.345.678-9'
      const rg = new Rg(formattedRg)

      expect(rg.rawValue).toBe('123456789')
      expect(rg.formattedValue).toBe('12.345.678-9')
    })

    it('should create a valid RG with letters', () => {
      const rgWithLetters = '12.345.678-X'
      const rg = new Rg(rgWithLetters)

      expect(rg.rawValue).toBe('12345678X')
      expect(rg.formattedValue).toBe('12.345.678-X')
    })

    it('should throw ValidationError when RG has invalid length', () => {
      expect(() => new Rg('123456')).toThrow(ValidationError)
      expect(() => new Rg('1234567890123')).toThrow(ValidationError)
    })

    it('should throw ValidationError when RG contains invalid characters', () => {
      expect(() => new Rg('123456789!')).toThrow(ValidationError)
      expect(() => new Rg('123456789$')).toThrow(ValidationError)
    })

    it('should throw ValidationError when RG is not a string', () => {
      expect(() => new Rg(null as unknown as string)).toThrow(ValidationError)
      expect(() => new Rg(undefined as unknown as string)).toThrow(ValidationError)
      expect(() => new Rg(123 as unknown as string)).toThrow(ValidationError)
    })
  })

  describe('static methods', () => {
    it('should create RG using create method', () => {
      const rg = Rg.create('123456789')
      expect(rg.value).toBe('123456789')
    })

    it('should validate RG using isValid method', () => {
      expect(Rg.isValid('123456789')).toBe(true)
      expect(Rg.isValid('12.345.678-9')).toBe(true)
      expect(Rg.isValid('123456')).toBe(false)
      expect(Rg.isValid('123456789!')).toBe(false)
    })
  })

  describe('equality', () => {
    it('should be equal when RGs have same value', () => {
      const rg1 = new Rg('123456789')
      const rg2 = new Rg('123456789')

      expect(rg1.equals(rg2)).toBe(true)
      expect(rg1.hashCode()).toBe(rg2.hashCode())
    })

    it('should be equal when RGs have same value but different format', () => {
      const rg1 = new Rg('123456789')
      const rg2 = new Rg('12.345.678-9')

      expect(rg1.equals(rg2)).toBe(true)
    })

    it('should not be equal when RGs have different values', () => {
      const rg1 = new Rg('123456789')
      const rg2 = new Rg('987654321')

      expect(rg1.equals(rg2)).toBe(false)
    })
  })

  describe('clone', () => {
    it('should create a copy of the RG', () => {
      const originalRg = new Rg('123456789')
      const clonedRg = originalRg.clone()

      expect(clonedRg.equals(originalRg)).toBe(true)
      expect(clonedRg).not.toBe(originalRg)
    })
  })

  describe('toString', () => {
    it('should return formatted RG', () => {
      const rg = new Rg('123456789')
      expect(rg.toString()).toBe('12.345.678-9')
    })
  })

  describe('edge cases', () => {
    it('should handle RG with minimum length (7 characters)', () => {
      const rg = new Rg('1234567')
      expect(rg.value).toBe('1234567')
      expect(rg.formattedValue).toBe('1234567')
    })

    it('should handle RG with maximum length (12 characters)', () => {
      const rg = new Rg('123456789012')
      expect(rg.value).toBe('123456789012')
      expect(rg.formattedValue).toBe('12.345.678-9012')
    })

    it('should handle RG with mixed case letters', () => {
      const rg = new Rg('12345678x')
      expect(rg.rawValue).toBe('12345678x')
    })
  })
})
