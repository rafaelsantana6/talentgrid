import { describe, expect, it } from 'vitest'

import { ValidationError } from '../types'
import { Salary } from './salary'

describe('Salary', () => {
  describe('constructor', () => {
    it('should create a valid salary when given a valid number', () => {
      const validSalary = 5000.50
      const salary = new Salary(validSalary)

      expect(salary.value).toBe(validSalary)
      expect(salary.formattedValue).toBe('R$\u00A05.000,50')
      expect(salary.cents).toBe(500050)
    })

    it('should create a valid salary with zero value', () => {
      const salary = new Salary(0)
      expect(salary.value).toBe(0)
      expect(salary.formattedValue).toBe('R$\u00A00,00')
      expect(salary.cents).toBe(0)
    })

    it('should create a valid salary with integer value', () => {
      const salary = new Salary(1000)
      expect(salary.value).toBe(1000)
      expect(salary.formattedValue).toBe('R$\u00A01.000,00')
      expect(salary.cents).toBe(100000)
    })

    it('should throw ValidationError when salary is negative', () => {
      expect(() => new Salary(-100)).toThrow(ValidationError)
    })

    it('should throw ValidationError when salary exceeds maximum value', () => {
      expect(() => new Salary(1000001)).toThrow(ValidationError)
    })

    it('should throw ValidationError when salary has more than 2 decimal places', () => {
      expect(() => new Salary(1000.123)).toThrow(ValidationError)
    })

    it('should throw ValidationError when salary is not a number', () => {
      expect(() => new Salary(null as unknown as number)).toThrow(ValidationError)
      expect(() => new Salary(undefined as unknown as number)).toThrow(ValidationError)
      expect(() => new Salary('1000' as unknown as number)).toThrow(ValidationError)
    })

    it('should throw ValidationError when salary is NaN', () => {
      expect(() => new Salary(Number.NaN)).toThrow(ValidationError)
    })
  })

  describe('static methods', () => {
    it('should create salary using create method', () => {
      const salary = Salary.create(5000)
      expect(salary.value).toBe(5000)
    })

    it('should create salary from cents using fromCents method', () => {
      const salary = Salary.fromCents(500050)
      expect(salary.value).toBe(5000.50)
      expect(salary.cents).toBe(500050)
    })

    it('should validate salary using isValid method', () => {
      expect(Salary.isValid(5000)).toBe(true)
      expect(Salary.isValid(5000.50)).toBe(true)
      expect(Salary.isValid(0)).toBe(true)
      expect(Salary.isValid(-100)).toBe(false)
      expect(Salary.isValid(1000001)).toBe(false)
    })
  })

  describe('equality', () => {
    it('should be equal when salaries have same value', () => {
      const salary1 = new Salary(5000)
      const salary2 = new Salary(5000)

      expect(salary1.equals(salary2)).toBe(true)
      expect(salary1.hashCode()).toBe(salary2.hashCode())
    })

    it('should be equal when salaries have same value but different representation', () => {
      const salary1 = new Salary(5000)
      const salary2 = new Salary(5000.00)

      expect(salary1.equals(salary2)).toBe(true)
    })

    it('should not be equal when salaries have different values', () => {
      const salary1 = new Salary(5000)
      const salary2 = new Salary(6000)

      expect(salary1.equals(salary2)).toBe(false)
    })
  })

  describe('clone', () => {
    it('should create a copy of the salary', () => {
      const originalSalary = new Salary(5000)
      const clonedSalary = originalSalary.clone()

      expect(clonedSalary.equals(originalSalary)).toBe(true)
      expect(clonedSalary).not.toBe(originalSalary)
    })
  })

  describe('toString', () => {
    it('should return formatted salary', () => {
      const salary = new Salary(5000.50)
      expect(salary.toString()).toBe('R$\u00A05.000,50')
    })
  })

  describe('formatting', () => {
    it('should format salary with thousands separator', () => {
      const salary = new Salary(10000)
      expect(salary.formattedValue).toBe('R$\u00A010.000,00')
    })

    it('should format salary with decimal places', () => {
      const salary = new Salary(1000.75)
      expect(salary.formattedValue).toBe('R$\u00A01.000,75')
    })

    it('should format large salary correctly', () => {
      const salary = new Salary(1000000)
      expect(salary.formattedValue).toBe('R$\u00A01.000.000,00')
    })
  })

  describe('cents conversion', () => {
    it('should convert salary to cents correctly', () => {
      const salary = new Salary(1000.50)
      expect(salary.cents).toBe(100050)
    })

    it('should convert integer salary to cents correctly', () => {
      const salary = new Salary(1000)
      expect(salary.cents).toBe(100000)
    })

    it('should create salary from cents correctly', () => {
      const salary = Salary.fromCents(100050)
      expect(salary.value).toBe(1000.50)
    })
  })

  describe('validation edge cases', () => {
    it('should accept salary at maximum allowed value', () => {
      const salary = new Salary(1000000)
      expect(salary.value).toBe(1000000)
    })

    it('should accept salary with exactly 2 decimal places', () => {
      const salary = new Salary(1000.99)
      expect(salary.value).toBe(1000.99)
    })

    it('should accept salary with 1 decimal place', () => {
      const salary = new Salary(1000.5)
      expect(salary.value).toBe(1000.5)
    })

    it('should accept salary with no decimal places', () => {
      const salary = new Salary(1000)
      expect(salary.value).toBe(1000)
    })
  })

  describe('edge cases', () => {
    it('should handle very small salary', () => {
      const salary = new Salary(0.01)
      expect(salary.value).toBe(0.01)
      expect(salary.cents).toBe(1)
    })

    it('should handle salary with trailing zeros', () => {
      const salary = new Salary(1000.00)
      expect(salary.value).toBe(1000)
    })

    it('should handle salary with leading zeros in decimal', () => {
      const salary = new Salary(1000.05)
      expect(salary.value).toBe(1000.05)
    })
  })
})
