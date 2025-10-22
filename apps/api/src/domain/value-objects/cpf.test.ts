import { describe, expect, it } from 'vitest'

import { ValidationError } from '../types'
import { Cpf } from './cpf'

describe('Cpf', () => {
  describe('constructor', () => {
    it('should create a valid CPF when given a valid number', () => {
      const validCpf = '11144477735'
      const cpf = new Cpf(validCpf)

      expect(cpf.value).toBe(validCpf)
      expect(cpf.rawValue).toBe(validCpf)
      expect(cpf.formattedValue).toBe('111.444.777-35')
    })

    it('should create a valid CPF when given a formatted number', () => {
      const formattedCpf = '111.444.777-35'
      const cpf = new Cpf(formattedCpf)

      expect(cpf.rawValue).toBe('11144477735')
      expect(cpf.formattedValue).toBe('111.444.777-35')
    })

    it('should throw ValidationError when CPF has invalid length', () => {
      expect(() => new Cpf('123456789')).toThrow(ValidationError)
      expect(() => new Cpf('123456789012')).toThrow(ValidationError)
    })

    it('should throw ValidationError when CPF has all digits equal', () => {
      expect(() => new Cpf('11111111111')).toThrow(ValidationError)
      expect(() => new Cpf('22222222222')).toThrow(ValidationError)
    })

    it('should throw ValidationError when CPF has invalid checksum', () => {
      expect(() => new Cpf('12345678901')).toThrow(ValidationError)
    })

    it('should throw ValidationError when CPF is not a string', () => {
      expect(() => new Cpf(null as unknown as string)).toThrow(ValidationError)
      expect(() => new Cpf(undefined as unknown as string)).toThrow(ValidationError)
      expect(() => new Cpf(123 as unknown as string)).toThrow(ValidationError)
    })
  })

  describe('static methods', () => {
    it('should create CPF using create method', () => {
      const cpf = Cpf.create('11144477735')
      expect(cpf.value).toBe('11144477735')
    })

    it('should validate CPF using isValid method', () => {
      expect(Cpf.isValid('11144477735')).toBe(true)
      expect(Cpf.isValid('111.444.777-35')).toBe(true)
      expect(Cpf.isValid('11111111111')).toBe(false)
      expect(Cpf.isValid('12345678901')).toBe(false)
    })
  })

  describe('equality', () => {
    it('should be equal when CPFs have same value', () => {
      const cpf1 = new Cpf('11144477735')
      const cpf2 = new Cpf('11144477735')

      expect(cpf1.equals(cpf2)).toBe(true)
      expect(cpf1.hashCode()).toBe(cpf2.hashCode())
    })

    it('should be equal when CPFs have same value but different format', () => {
      const cpf1 = new Cpf('11144477735')
      const cpf2 = new Cpf('111.444.777-35')

      expect(cpf1.equals(cpf2)).toBe(true)
    })

    it('should not be equal when CPFs have different values', () => {
      const cpf1 = new Cpf('11144477735')
      const cpf2 = new Cpf('12345678909')

      expect(cpf1.equals(cpf2)).toBe(false)
    })
  })

  describe('clone', () => {
    it('should create a copy of the CPF', () => {
      const originalCpf = new Cpf('11144477735')
      const clonedCpf = originalCpf.clone()

      expect(clonedCpf.equals(originalCpf)).toBe(true)
      expect(clonedCpf).not.toBe(originalCpf)
    })
  })

  describe('toString', () => {
    it('should return formatted CPF', () => {
      const cpf = new Cpf('11144477735')
      expect(cpf.toString()).toBe('111.444.777-35')
    })
  })
})
