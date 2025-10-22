import { describe, expect, it } from 'vitest'

import { ValidationError } from '../types'
import { Address } from './address'
import { AddressType } from './enums'

describe('Address', () => {
  describe('constructor', () => {
    it('should create a valid address when given valid data', () => {
      const address = new Address(
        'Rua das Flores',
        '123',
        'Centro',
        'São Paulo',
        'SP',
        '01234567',
        'Brasil',
        AddressType.RESIDENTIAL
      )

      expect(address.street).toBe('Rua das Flores')
      expect(address.number).toBe('123')
      expect(address.neighborhood).toBe('Centro')
      expect(address.city).toBe('São Paulo')
      expect(address.state).toBe('SP')
      expect(address.zipCode).toBe('01234567')
      expect(address.country).toBe('Brasil')
      expect(address.type).toBe(AddressType.RESIDENTIAL)
    })

    it('should create a valid address with complement', () => {
      const address = new Address(
        'Rua das Flores',
        '123',
        'Centro',
        'São Paulo',
        'SP',
        '01234567',
        'Brasil',
        AddressType.RESIDENTIAL,
        'Apto 45'
      )

      expect(address.complement).toBe('Apto 45')
    })

    it('should use default values for country and type', () => {
      const address = new Address(
        'Rua das Flores',
        '123',
        'Centro',
        'São Paulo',
        'SP',
        '01234567'
      )

      expect(address.country).toBe('Brasil')
      expect(address.type).toBe(AddressType.RESIDENTIAL)
    })

    it('should throw ValidationError when street is too short', () => {
      expect(() => new Address('Ru', '123', 'Centro', 'São Paulo', 'SP', '01234567')).toThrow(ValidationError)
    })

    it('should throw ValidationError when street is too long', () => {
      const longStreet = 'R'.repeat(201)
      expect(() => new Address(longStreet, '123', 'Centro', 'São Paulo', 'SP', '01234567')).toThrow(ValidationError)
    })

    it('should throw ValidationError when number is empty', () => {
      expect(() => new Address('Rua das Flores', '', 'Centro', 'São Paulo', 'SP', '01234567')).toThrow(ValidationError)
    })

    it('should throw ValidationError when number is too long', () => {
      const longNumber = '1'.repeat(21)
      expect(() => new Address('Rua das Flores', longNumber, 'Centro', 'São Paulo', 'SP', '01234567')).toThrow(ValidationError)
    })

    it('should throw ValidationError when neighborhood is too short', () => {
      expect(() => new Address('Rua das Flores', '123', 'C', 'São Paulo', 'SP', '01234567')).toThrow(ValidationError)
    })

    it('should throw ValidationError when city is too short', () => {
      expect(() => new Address('Rua das Flores', '123', 'Centro', 'S', 'SP', '01234567')).toThrow(ValidationError)
    })

    it('should throw ValidationError when state is not 2 characters', () => {
      expect(() => new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SPA', '01234567')).toThrow(ValidationError)
    })

    it('should throw ValidationError when state is invalid for Brazil', () => {
      expect(() => new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'XX', '01234567')).toThrow(ValidationError)
    })

    it('should throw ValidationError when complement is too long', () => {
      const longComplement = 'C'.repeat(101)
      expect(() => new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234567', 'Brasil', AddressType.RESIDENTIAL, longComplement)).toThrow(ValidationError)
    })
  })

  describe('static methods', () => {
    it('should create address using create method', () => {
      const address = Address.create({
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234567',
        country: 'Brasil',
        type: AddressType.RESIDENTIAL,
        complement: 'Apto 45'
      })

      expect(address.street).toBe('Rua das Flores')
      expect(address.complement).toBe('Apto 45')
    })
  })

  describe('equality', () => {
    it('should be equal when addresses have same values', () => {
      const address1 = new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234567')
      const address2 = new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234567')

      expect(address1.equals(address2)).toBe(true)
      expect(address1.hashCode()).toBe(address2.hashCode())
    })

    it('should not be equal when addresses have different values', () => {
      const address1 = new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234567')
      const address2 = new Address('Rua das Rosas', '123', 'Centro', 'São Paulo', 'SP', '01234567')

      expect(address1.equals(address2)).toBe(false)
    })
  })

  describe('clone', () => {
    it('should create a copy of the address', () => {
      const originalAddress = new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234567')
      const clonedAddress = originalAddress.clone()

      expect(clonedAddress.equals(originalAddress)).toBe(true)
      expect(clonedAddress).not.toBe(originalAddress)
    })
  })

  describe('toString', () => {
    it('should return formatted address', () => {
      const address = new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234567')
      expect(address.toString()).toBe('Rua das Flores, 123, Centro, São Paulo/SP, 01234567')
    })

    it('should return formatted address with complement', () => {
      const address = new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234567', 'Brasil', AddressType.RESIDENTIAL, 'Apto 45')
      expect(address.toString()).toBe('Rua das Flores, 123, Apto 45, Centro, São Paulo/SP, 01234567')
    })

    it('should return formatted address with non-Brazilian country', () => {
      const address = new Address('Main Street', '123', 'Downtown', 'New York', 'NY', '10001', 'USA')
      expect(address.toString()).toBe('Main Street, 123, Downtown, New York/NY, 10001, USA')
    })
  })

  describe('formatting', () => {
    it('should format address correctly', () => {
      const address = new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234567')
      expect(address.formattedAddress).toBe('Rua das Flores, 123, Centro, São Paulo/SP, 01234567')
    })

    it('should format address with complement', () => {
      const address = new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234567', 'Brasil', AddressType.RESIDENTIAL, 'Apto 45')
      expect(address.formattedAddress).toBe('Rua das Flores, 123, Apto 45, Centro, São Paulo/SP, 01234567')
    })
  })

  describe('state validation', () => {
    it('should accept all valid Brazilian states', () => {
      const validStates = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ]

      validStates.forEach((state) => {
        expect(() => new Address('Rua das Flores', '123', 'Centro', 'São Paulo', state, '01234567')).not.toThrow()
      })
    })

    it('should accept non-Brazilian states', () => {
      expect(() => new Address('Main Street', '123', 'Downtown', 'New York', 'NY', '10001', 'USA')).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle address with minimum valid street length', () => {
      const address = new Address('Rua', '123', 'Centro', 'São Paulo', 'SP', '01234567')
      expect(address.street).toBe('Rua')
    })

    it('should handle address with maximum valid street length', () => {
      const longStreet = 'R'.repeat(200)
      const address = new Address(longStreet, '123', 'Centro', 'São Paulo', 'SP', '01234567')
      expect(address.street).toBe(longStreet)
    })

    it('should handle address with maximum valid number length', () => {
      const longNumber = '1'.repeat(20)
      const address = new Address('Rua das Flores', longNumber, 'Centro', 'São Paulo', 'SP', '01234567')
      expect(address.number).toBe(longNumber)
    })

    it('should handle address with maximum valid complement length', () => {
      const longComplement = 'C'.repeat(100)
      const address = new Address('Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234567', 'Brasil', AddressType.RESIDENTIAL, longComplement)
      expect(address.complement).toBe(longComplement)
    })
  })
})
