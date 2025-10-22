import { describe, it, expect } from 'vitest'
import { Email } from './email'
import { ValidationError } from '../types'

describe('Email', () => {
  describe('constructor', () => {
    it('should create a valid email when given a valid address', () => {
      const validEmail = 'test@example.com'
      const email = new Email(validEmail)
      
      expect(email.value).toBe(validEmail)
      expect(email.username).toBe('test')
      expect(email.domain).toBe('example.com')
    })

    it('should convert email to lowercase', () => {
      const email = new Email('TEST@EXAMPLE.COM')
      expect(email.value).toBe('test@example.com')
    })

    it('should trim whitespace', () => {
      const email = new Email('  test@example.com  ')
      expect(email.value).toBe('test@example.com')
    })

    it('should throw ValidationError when email is empty', () => {
      expect(() => new Email('')).toThrow(ValidationError)
      expect(() => new Email('   ')).toThrow(ValidationError)
    })

    it('should throw ValidationError when email does not contain @', () => {
      expect(() => new Email('testexample.com')).toThrow(ValidationError)
    })

    it('should throw ValidationError when email contains multiple @', () => {
      expect(() => new Email('test@@example.com')).toThrow(ValidationError)
      expect(() => new Email('test@example@com')).toThrow(ValidationError)
    })

    it('should throw ValidationError when email has invalid format', () => {
      expect(() => new Email('test@')).toThrow(ValidationError)
      expect(() => new Email('@example.com')).toThrow(ValidationError)
      expect(() => new Email('test.example.com')).toThrow(ValidationError)
    })

    it('should throw ValidationError when email exceeds maximum length', () => {
      const longEmail = `${'a'.repeat(250)}@example.com`
      expect(() => new Email(longEmail)).toThrow(ValidationError)
    })

    it('should throw ValidationError when username exceeds maximum length', () => {
      const longUsername = `${'a'.repeat(65)}@example.com`
      expect(() => new Email(longUsername)).toThrow(ValidationError)
    })

    it('should throw ValidationError when username starts or ends with dot', () => {
      expect(() => new Email('.test@example.com')).toThrow(ValidationError)
      expect(() => new Email('test.@example.com')).toThrow(ValidationError)
    })

    it('should throw ValidationError when username has consecutive dots', () => {
      expect(() => new Email('test..test@example.com')).toThrow(ValidationError)
    })

    it('should throw ValidationError when email is not a string', () => {
      expect(() => new Email(null as any)).toThrow(ValidationError)
      expect(() => new Email(undefined as any)).toThrow(ValidationError)
      expect(() => new Email(123 as any)).toThrow(ValidationError)
    })
  })

  describe('static methods', () => {
    it('should create email using create method', () => {
      const email = Email.create('test@example.com')
      expect(email.value).toBe('test@example.com')
    })

    it('should validate email using isValid method', () => {
      expect(Email.isValid('test@example.com')).toBe(true)
      expect(Email.isValid('user.name@domain.co.uk')).toBe(true)
      expect(Email.isValid('invalid-email')).toBe(false)
      expect(Email.isValid('')).toBe(false)
    })
  })

  describe('equality', () => {
    it('should be equal when emails have same value', () => {
      const email1 = new Email('test@example.com')
      const email2 = new Email('test@example.com')
      
      expect(email1.equals(email2)).toBe(true)
      expect(email1.hashCode()).toBe(email2.hashCode())
    })

    it('should be equal when emails have same value but different case', () => {
      const email1 = new Email('test@example.com')
      const email2 = new Email('TEST@EXAMPLE.COM')
      
      expect(email1.equals(email2)).toBe(true)
    })

    it('should not be equal when emails have different values', () => {
      const email1 = new Email('test@example.com')
      const email2 = new Email('test2@example.com')
      
      expect(email1.equals(email2)).toBe(false)
    })
  })

  describe('clone', () => {
    it('should create a copy of the email', () => {
      const originalEmail = new Email('test@example.com')
      const clonedEmail = originalEmail.clone()
      
      expect(clonedEmail.equals(originalEmail)).toBe(true)
      expect(clonedEmail).not.toBe(originalEmail)
    })
  })

  describe('toString', () => {
    it('should return email value', () => {
      const email = new Email('test@example.com')
      expect(email.toString()).toBe('test@example.com')
    })
  })
})
