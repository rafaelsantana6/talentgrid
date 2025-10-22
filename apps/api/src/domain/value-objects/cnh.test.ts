import { describe, expect, it } from 'vitest'

import { ValidationError } from '../types'
import { Cnh } from './cnh'

describe('Cnh', () => {
  describe('constructor', () => {
    it('should create a valid CNH when given a valid number', () => {
      const validCnh = '12345678901'
      const cnh = new Cnh(validCnh)

      expect(cnh.value).toBe(validCnh)
      expect(cnh.rawValue).toBe(validCnh)
      expect(cnh.formattedValue).toBe('123.456.789-01')
    })

    it('should create a valid CNH when given a formatted number', () => {
      const formattedCnh = '123.456.789-01'
      const cnh = new Cnh(formattedCnh)

      expect(cnh.rawValue).toBe('12345678901')
      expect(cnh.formattedValue).toBe('123.456.789-01')
    })

    it('should throw ValidationError when CNH has invalid length', () => {
      expect(() => new Cnh('123456789')).toThrow(ValidationError)
      expect(() => new Cnh('123456789012')).toThrow(ValidationError)
    })

    it('should throw ValidationError when CNH has all digits equal', () => {
      expect(() => new Cnh('11111111111')).toThrow(ValidationError)
      expect(() => new Cnh('22222222222')).toThrow(ValidationError)
    })

    it('should throw ValidationError when CNH has invalid checksum', () => {
      expect(() => new Cnh('12345678900')).toThrow(ValidationError)
    })

    it('should throw ValidationError when CNH is not a string', () => {
      expect(() => new Cnh(null as unknown as string)).toThrow(ValidationError)
      expect(() => new Cnh(undefined as unknown as string)).toThrow(ValidationError)
      expect(() => new Cnh(123 as unknown as string)).toThrow(ValidationError)
    })
  })

  describe('static methods', () => {
    it('should create CNH using create method', () => {
      const cnh = Cnh.create('12345678901')
      expect(cnh.value).toBe('12345678901')
    })

    it('should validate CNH using isValid method', () => {
      expect(Cnh.isValid('12345678901')).toBe(true)
      expect(Cnh.isValid('123.456.789-01')).toBe(true)
      expect(Cnh.isValid('11111111111')).toBe(false)
      expect(Cnh.isValid('12345678900')).toBe(false)
    })
  })

  describe('equality', () => {
    it('should be equal when CNHs have same value', () => {
      const cnh1 = new Cnh('12345678901')
      const cnh2 = new Cnh('12345678901')

      expect(cnh1.equals(cnh2)).toBe(true)
      expect(cnh1.hashCode()).toBe(cnh2.hashCode())
    })

    it('should be equal when CNHs have same value but different format', () => {
      const cnh1 = new Cnh('12345678901')
      const cnh2 = new Cnh('123.456.789-01')

      expect(cnh1.equals(cnh2)).toBe(true)
    })

    it('should not be equal when CNHs have different values', () => {
      const cnh1 = new Cnh('12345678901')
      const cnh2 = new Cnh('98765432109')

      expect(cnh1.equals(cnh2)).toBe(false)
    })
  })

  describe('clone', () => {
    it('should create a copy of the CNH', () => {
      const originalCnh = new Cnh('12345678901')
      const clonedCnh = originalCnh.clone()

      expect(clonedCnh.equals(originalCnh)).toBe(true)
      expect(clonedCnh).not.toBe(originalCnh)
    })
  })

  describe('toString', () => {
    it('should return formatted CNH', () => {
      const cnh = new Cnh('12345678901')
      expect(cnh.toString()).toBe('123.456.789-01')
    })
  })

  describe('checksum validation', () => {
    it('should validate correct CNH checksum', () => {
      // CNH válida com dígitos verificadores corretos
      const validCnh = '12345678901'
      expect(() => new Cnh(validCnh)).not.toThrow()
    })

    it('should reject CNH with incorrect checksum', () => {
      // CNH com dígitos verificadores incorretos
      const invalidCnh = '12345678900'
      expect(() => new Cnh(invalidCnh)).toThrow(ValidationError)
    })
  })

  describe('edge cases', () => {
    it('should handle CNH with leading zeros', () => {
      const cnh = new Cnh('01234567890')
      expect(cnh.rawValue).toBe('01234567890')
    })

    it('should handle CNH with maximum digits', () => {
      const cnh = new Cnh('99999999998')
      expect(cnh.rawValue).toBe('99999999998')
    })
  })
})
