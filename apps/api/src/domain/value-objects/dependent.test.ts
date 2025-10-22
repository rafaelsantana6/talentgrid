import { describe, expect, it } from 'vitest'

import { ValidationError } from '../types'
import { Dependent } from './dependent'
import { DependentStatus, DependentType, Gender } from './enums'

describe('Dependent', () => {
  describe('constructor', () => {
    it('should create a valid dependent when given valid data', () => {
      const birthDate = new Date('2010-01-01')
      const dependent = new Dependent(
        'João Silva',
        birthDate,
        Gender.MALE,
        DependentType.CHILD,
        DependentStatus.ACTIVE,
        false,
        '12345678901',
        '123456789',
        '11987654321',
        'joao@example.com'
      )

      expect(dependent.name).toBe('João Silva')
      expect(dependent.birthDate).toEqual(birthDate)
      expect(dependent.gender).toBe(Gender.MALE)
      expect(dependent.type).toBe(DependentType.CHILD)
      expect(dependent.status).toBe(DependentStatus.ACTIVE)
      expect(dependent.isEmergencyContact).toBe(false)
      expect(dependent.cpf).toBe('12345678901')
      expect(dependent.rg).toBe('123456789')
      expect(dependent.phone).toBe('11987654321')
      expect(dependent.email).toBe('joao@example.com')
    })

    it('should create a valid dependent with minimal data', () => {
      const birthDate = new Date('2010-01-01')
      const dependent = new Dependent(
        'João Silva',
        birthDate,
        Gender.MALE,
        DependentType.CHILD
      )

      expect(dependent.name).toBe('João Silva')
      expect(dependent.status).toBe(DependentStatus.ACTIVE)
      expect(dependent.isEmergencyContact).toBe(false)
    })

    it('should throw ValidationError when name is too short', () => {
      const birthDate = new Date('2010-01-01')
      expect(() => new Dependent('J', birthDate, Gender.MALE, DependentType.CHILD)).toThrow(ValidationError)
    })

    it('should throw ValidationError when name is too long', () => {
      const birthDate = new Date('2010-01-01')
      const longName = 'J'.repeat(101)
      expect(() => new Dependent(longName, birthDate, Gender.MALE, DependentType.CHILD)).toThrow(ValidationError)
    })

    it('should throw ValidationError when birth date is in the future', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      expect(() => new Dependent('João Silva', futureDate, Gender.MALE, DependentType.CHILD)).toThrow(ValidationError)
    })

    it('should throw ValidationError when birth date is too old', () => {
      const oldDate = new Date()
      oldDate.setFullYear(oldDate.getFullYear() - 121)
      expect(() => new Dependent('João Silva', oldDate, Gender.MALE, DependentType.CHILD)).toThrow(ValidationError)
    })

    it('should throw ValidationError when CPF format is invalid', () => {
      const birthDate = new Date('2010-01-01')
      expect(() => new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD, DependentStatus.ACTIVE, false, '123')).toThrow(ValidationError)
    })

    it('should throw ValidationError when RG format is invalid', () => {
      const birthDate = new Date('2010-01-01')
      expect(() => new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD, DependentStatus.ACTIVE, false, undefined, '123')).toThrow(ValidationError)
    })

    it('should throw ValidationError when phone format is invalid', () => {
      const birthDate = new Date('2010-01-01')
      expect(() => new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD, DependentStatus.ACTIVE, false, undefined, undefined, '123')).toThrow(ValidationError)
    })

    it('should throw ValidationError when email format is invalid', () => {
      const birthDate = new Date('2010-01-01')
      expect(() => new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD, DependentStatus.ACTIVE, false, undefined, undefined, undefined, 'invalid-email')).toThrow(ValidationError)
    })

    it('should throw ValidationError when spouse is under 16', () => {
      const birthDate = new Date('2010-01-01') // 14 years old
      expect(() => new Dependent('Maria Silva', birthDate, Gender.FEMALE, DependentType.SPOUSE)).toThrow(ValidationError)
    })

    it('should throw ValidationError when child is over 24', () => {
      const birthDate = new Date('1990-01-01') // Over 24 years old
      expect(() => new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)).toThrow(ValidationError)
    })
  })

  describe('static methods', () => {
    it('should create dependent using create method', () => {
      const birthDate = new Date('2010-01-01')
      const dependent = Dependent.create({
        name: 'João Silva',
        birthDate,
        gender: Gender.MALE,
        type: DependentType.CHILD,
        status: DependentStatus.ACTIVE,
        isEmergencyContact: false,
        cpf: '12345678901',
        phone: '11987654321'
      })

      expect(dependent.name).toBe('João Silva')
      expect(dependent.cpf).toBe('12345678901')
    })
  })

  describe('equality', () => {
    it('should be equal when dependents have same values', () => {
      const birthDate = new Date('2010-01-01')
      const dependent1 = new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)
      const dependent2 = new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)

      expect(dependent1.equals(dependent2)).toBe(true)
      expect(dependent1.hashCode()).toBe(dependent2.hashCode())
    })

    it('should not be equal when dependents have different values', () => {
      const birthDate = new Date('2010-01-01')
      const dependent1 = new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)
      const dependent2 = new Dependent('Maria Silva', birthDate, Gender.FEMALE, DependentType.CHILD)

      expect(dependent1.equals(dependent2)).toBe(false)
    })
  })

  describe('clone', () => {
    it('should create a copy of the dependent', () => {
      const birthDate = new Date('2010-01-01')
      const originalDependent = new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)
      const clonedDependent = originalDependent.clone()

      expect(clonedDependent.equals(originalDependent)).toBe(true)
      expect(clonedDependent).not.toBe(originalDependent)
    })
  })

  describe('toString', () => {
    it('should return formatted dependent', () => {
      const birthDate = new Date('2010-01-01')
      const dependent = new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)
      expect(dependent.toString()).toBe('João Silva (child, 14 anos)')
    })
  })

  describe('age calculation', () => {
    it('should calculate age correctly', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 25)
      const dependent = new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)
      
      expect(dependent.age).toBe(25)
    })

    it('should identify minor dependents', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 15)
      const dependent = new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)
      
      expect(dependent.isMinor).toBe(true)
    })

    it('should identify adult dependents', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 25)
      const dependent = new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)
      
      expect(dependent.isMinor).toBe(false)
    })
  })

  describe('dependent type validation', () => {
    it('should accept valid spouse age', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 25)
      expect(() => new Dependent('Maria Silva', birthDate, Gender.FEMALE, DependentType.SPOUSE)).not.toThrow()
    })

    it('should accept valid child age', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 10)
      expect(() => new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)).not.toThrow()
    })

    it('should accept child at maximum age', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 24)
      expect(() => new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)).not.toThrow()
    })
  })

  describe('contact information', () => {
    it('should handle dependent with all contact information', () => {
      const birthDate = new Date('2010-01-01')
      const dependent = new Dependent(
        'João Silva',
        birthDate,
        Gender.MALE,
        DependentType.CHILD,
        DependentStatus.ACTIVE,
        true,
        '12345678901',
        '123456789',
        '11987654321',
        'joao@example.com'
      )

      expect(dependent.cpf).toBe('12345678901')
      expect(dependent.rg).toBe('123456789')
      expect(dependent.phone).toBe('11987654321')
      expect(dependent.email).toBe('joao@example.com')
      expect(dependent.isEmergencyContact).toBe(true)
    })

    it('should handle dependent with minimal contact information', () => {
      const birthDate = new Date('2010-01-01')
      const dependent = new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)

      expect(dependent.cpf).toBeUndefined()
      expect(dependent.rg).toBeUndefined()
      expect(dependent.phone).toBeUndefined()
      expect(dependent.email).toBeUndefined()
      expect(dependent.isEmergencyContact).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle dependent with minimum valid name length', () => {
      const birthDate = new Date('2010-01-01')
      const dependent = new Dependent('Jo', birthDate, Gender.MALE, DependentType.CHILD)
      expect(dependent.name).toBe('Jo')
    })

    it('should handle dependent with maximum valid name length', () => {
      const birthDate = new Date('2010-01-01')
      const longName = 'J'.repeat(100)
      const dependent = new Dependent(longName, birthDate, Gender.MALE, DependentType.CHILD)
      expect(dependent.name).toBe(longName)
    })

    it('should handle dependent born today', () => {
      const today = new Date()
      const dependent = new Dependent('João Silva', today, Gender.MALE, DependentType.CHILD)
      expect(dependent.age).toBe(0)
      expect(dependent.isMinor).toBe(true)
    })

    it('should handle dependent with maximum valid age', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 120)
      const dependent = new Dependent('João Silva', birthDate, Gender.MALE, DependentType.CHILD)
      expect(dependent.age).toBe(120)
    })
  })
})
