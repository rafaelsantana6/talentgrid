import { describe, expect, it } from 'vitest'

import { ValidationError } from '../types'
import { Cep } from './cep'

describe('Cep', () => {
  describe('constructor', () => {
    it('should create a valid CEP when given a valid number', () => {
      const validCep = '01234567'
      const cep = new Cep(validCep)

      expect(cep.value).toBe(validCep)
      expect(cep.rawValue).toBe(validCep)
      expect(cep.formattedValue).toBe('01234-567')
      expect(cep.mainPart).toBe('01234')
      expect(cep.suffix).toBe('567')
    })

    it('should create a valid CEP when given a formatted number', () => {
      const formattedCep = '01234-567'
      const cep = new Cep(formattedCep)

      expect(cep.rawValue).toBe('01234567')
      expect(cep.formattedValue).toBe('01234-567')
    })

    it('should throw ValidationError when CEP has invalid length', () => {
      expect(() => new Cep('1234567')).toThrow(ValidationError)
      expect(() => new Cep('123456789')).toThrow(ValidationError)
    })

    it('should throw ValidationError when CEP has all digits equal', () => {
      expect(() => new Cep('11111111')).toThrow(ValidationError)
      expect(() => new Cep('22222222')).toThrow(ValidationError)
      expect(() => new Cep('00000000')).toThrow(ValidationError)
    })

    it('should throw ValidationError when CEP is not a string', () => {
      expect(() => new Cep(null as unknown as string)).toThrow(ValidationError)
      expect(() => new Cep(undefined as unknown as string)).toThrow(ValidationError)
      expect(() => new Cep(123 as unknown as string)).toThrow(ValidationError)
    })
  })

  describe('static methods', () => {
    it('should create CEP using create method', () => {
      const cep = Cep.create('01234567')
      expect(cep.value).toBe('01234567')
    })

    it('should validate CEP using isValid method', () => {
      expect(Cep.isValid('01234567')).toBe(true)
      expect(Cep.isValid('01234-567')).toBe(true)
      expect(Cep.isValid('11111111')).toBe(false)
      expect(Cep.isValid('1234567')).toBe(false)
    })
  })

  describe('equality', () => {
    it('should be equal when CEPs have same value', () => {
      const cep1 = new Cep('01234567')
      const cep2 = new Cep('01234567')

      expect(cep1.equals(cep2)).toBe(true)
      expect(cep1.hashCode()).toBe(cep2.hashCode())
    })

    it('should be equal when CEPs have same value but different format', () => {
      const cep1 = new Cep('01234567')
      const cep2 = new Cep('01234-567')

      expect(cep1.equals(cep2)).toBe(true)
    })

    it('should not be equal when CEPs have different values', () => {
      const cep1 = new Cep('01234567')
      const cep2 = new Cep('76543210')

      expect(cep1.equals(cep2)).toBe(false)
    })
  })

  describe('clone', () => {
    it('should create a copy of the CEP', () => {
      const originalCep = new Cep('01234567')
      const clonedCep = originalCep.clone()

      expect(clonedCep.equals(originalCep)).toBe(true)
      expect(clonedCep).not.toBe(originalCep)
    })
  })

  describe('toString', () => {
    it('should return formatted CEP', () => {
      const cep = new Cep('01234567')
      expect(cep.toString()).toBe('01234-567')
    })
  })

  describe('formatting', () => {
    it('should format CEP correctly', () => {
      const cep = new Cep('01234567')
      expect(cep.formattedValue).toBe('01234-567')
    })

    it('should handle CEP with leading zeros', () => {
      const cep = new Cep('00000001')
      expect(cep.formattedValue).toBe('00000-001')
    })

    it('should handle CEP with maximum digits', () => {
      const cep = new Cep('99999998')
      expect(cep.formattedValue).toBe('99999-998')
    })
  })

  describe('parts extraction', () => {
    it('should extract main part correctly', () => {
      const cep = new Cep('01234567')
      expect(cep.mainPart).toBe('01234')
    })

    it('should extract suffix correctly', () => {
      const cep = new Cep('01234567')
      expect(cep.suffix).toBe('567')
    })
  })

  describe('invalid sequences', () => {
    it('should reject common invalid sequences', () => {
      const invalidSequences = [
        '00000000',
        '11111111',
        '22222222',
        '33333333',
        '44444444',
        '55555555',
        '66666666',
        '77777777',
        '88888888',
        '99999999',
      ]

      invalidSequences.forEach((sequence) => {
        expect(() => new Cep(sequence)).toThrow(ValidationError)
      })
    })
  })

  describe('edge cases', () => {
    it('should handle CEP with minimum valid digits', () => {
      const cep = new Cep('00000001')
      expect(cep.rawValue).toBe('00000001')
    })

    it('should handle CEP with maximum valid digits', () => {
      const cep = new Cep('99999998')
      expect(cep.rawValue).toBe('99999998')
    })

    it('should handle CEP with mixed digits', () => {
      const cep = new Cep('12345678')
      expect(cep.rawValue).toBe('12345678')
      expect(cep.formattedValue).toBe('12345-678')
    })
  })
})
