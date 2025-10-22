import { describe, expect, it } from 'vitest'

import { IdFactory, NumberId, StringId, UuidId } from '../index'

describe('StringId', () => {
  describe('constructor', () => {
    it('should create StringId when valid string is provided', () => {
      // Arrange
      const value = 'valid-id-123'

      // Act
      const id = new StringId(value)

      // Assert
      expect(id.value).toBe(value)
    })

    it('should throw ValidationError when null is provided', () => {
      // Arrange
      const value = null as any

      // Act & Assert
      expect(() => new StringId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when undefined is provided', () => {
      // Arrange
      const value = undefined as any

      // Act & Assert
      expect(() => new StringId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when empty string is provided', () => {
      // Arrange
      const value = ''

      // Act & Assert
      expect(() => new StringId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when whitespace-only string is provided', () => {
      // Arrange
      const value = '   '

      // Act & Assert
      expect(() => new StringId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when non-string value is provided', () => {
      // Arrange
      const value = 123 as any

      // Act & Assert
      expect(() => new StringId(value)).toThrow(ValidationError)
    })
  })

  describe('create', () => {
    it('should return success result when valid string is provided', () => {
      // Arrange
      const value = 'valid-id'

      // Act
      const result = StringId.create(value)

      // Assert
      expect(result.isSuccess).toBe(true)
      if (result.isSuccess) {
        expect(result.value.value).toBe(value)
      }
    })

    it('should return failure result when invalid string is provided', () => {
      // Arrange
      const value = ''

      // Act
      const result = StringId.create(value)

      // Assert
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })
  })

  describe('generate', () => {
    it('should generate a valid StringId', () => {
      // Act
      const id = StringId.generate()

      // Assert
      expect(id).toBeInstanceOf(StringId)
      expect(id.value).toBeDefined()
      expect(typeof id.value).toBe('string')
      expect(id.value.length).toBeGreaterThan(0)
    })

    it('should generate different IDs on multiple calls', () => {
      // Act
      const id1 = StringId.generate()
      const id2 = StringId.generate()

      // Assert
      expect(id1.value).not.toBe(id2.value)
    })
  })

  describe('equals', () => {
    it('should return true when comparing equal StringIds', () => {
      // Arrange
      const value = 'test-id'
      const id1 = new StringId(value)
      const id2 = new StringId(value)

      // Act
      const result = id1.equals(id2)

      // Assert
      expect(result).toBe(true)
    })

    it('should return false when comparing different StringIds', () => {
      // Arrange
      const id1 = new StringId('id-1')
      const id2 = new StringId('id-2')

      // Act
      const result = id1.equals(id2)

      // Assert
      expect(result).toBe(false)
    })

    it('should return false when comparing with null', () => {
      // Arrange
      const id = new StringId('test-id')

      // Act
      const result = id.equals(null as any)

      // Assert
      expect(result).toBe(false)
    })

    it('should return false when comparing with different type', () => {
      // Arrange
      const stringId = new StringId('test-id')
      const numberId = new NumberId(123)

      // Act
      const result = stringId.equals(numberId as any)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('toString', () => {
    it('should return string representation of the ID', () => {
      // Arrange
      const value = 'test-id'
      const id = new StringId(value)

      // Act
      const result = id.toString()

      // Assert
      expect(result).toBe(value)
    })
  })

  describe('hashCode', () => {
    it('should return same hash code for equal IDs', () => {
      // Arrange
      const value = 'test-id'
      const id1 = new StringId(value)
      const id2 = new StringId(value)

      // Act
      const hash1 = id1.hashCode()
      const hash2 = id2.hashCode()

      // Assert
      expect(hash1).toBe(hash2)
    })

    it('should return different hash codes for different IDs', () => {
      // Arrange
      const id1 = new StringId('id-1')
      const id2 = new StringId('id-2')

      // Act
      const hash1 = id1.hashCode()
      const hash2 = id2.hashCode()

      // Assert
      expect(hash1).not.toBe(hash2)
    })
  })
})

describe('NumberId', () => {
  describe('constructor', () => {
    it('should create NumberId when valid positive integer is provided', () => {
      // Arrange
      const value = 123

      // Act
      const id = new NumberId(value)

      // Assert
      expect(id.value).toBe(value)
    })

    it('should throw ValidationError when null is provided', () => {
      // Arrange
      const value = null as any

      // Act & Assert
      expect(() => new NumberId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when undefined is provided', () => {
      // Arrange
      const value = undefined as any

      // Act & Assert
      expect(() => new NumberId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when NaN is provided', () => {
      // Arrange
      const value = NaN

      // Act & Assert
      expect(() => new NumberId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when non-integer is provided', () => {
      // Arrange
      const value = 123.45

      // Act & Assert
      expect(() => new NumberId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when negative number is provided', () => {
      // Arrange
      const value = -1

      // Act & Assert
      expect(() => new NumberId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when zero is provided', () => {
      // Arrange
      const value = 0

      // Act & Assert
      expect(() => new NumberId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when non-number value is provided', () => {
      // Arrange
      const value = '123' as any

      // Act & Assert
      expect(() => new NumberId(value)).toThrow(ValidationError)
    })
  })

  describe('create', () => {
    it('should return success result when valid number is provided', () => {
      // Arrange
      const value = 123

      // Act
      const result = NumberId.create(value)

      // Assert
      expect(result.isSuccess).toBe(true)
      if (result.isSuccess) {
        expect(result.value.value).toBe(value)
      }
    })

    it('should return failure result when invalid number is provided', () => {
      // Arrange
      const value = -1

      // Act
      const result = NumberId.create(value)

      // Assert
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })
  })

  describe('equals', () => {
    it('should return true when comparing equal NumberIds', () => {
      // Arrange
      const value = 123
      const id1 = new NumberId(value)
      const id2 = new NumberId(value)

      // Act
      const result = id1.equals(id2)

      // Assert
      expect(result).toBe(true)
    })

    it('should return false when comparing different NumberIds', () => {
      // Arrange
      const id1 = new NumberId(123)
      const id2 = new NumberId(456)

      // Act
      const result = id1.equals(id2)

      // Assert
      expect(result).toBe(false)
    })
  })
})

describe('UuidId', () => {
  describe('constructor', () => {
    it('should create UuidId when valid UUID is provided', () => {
      // Arrange
      const value = '550e8400-e29b-41d4-a716-446655440000'

      // Act
      const id = new UuidId(value)

      // Assert
      expect(id.value).toBe(value)
    })

    it('should throw ValidationError when null is provided', () => {
      // Arrange
      const value = null as any

      // Act & Assert
      expect(() => new UuidId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when undefined is provided', () => {
      // Arrange
      const value = undefined as any

      // Act & Assert
      expect(() => new UuidId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when empty string is provided', () => {
      // Arrange
      const value = ''

      // Act & Assert
      expect(() => new UuidId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when invalid UUID format is provided', () => {
      // Arrange
      const value = 'not-a-uuid'

      // Act & Assert
      expect(() => new UuidId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when UUID without hyphens is provided', () => {
      // Arrange
      const value = '550e8400e29b41d4a716446655440000'

      // Act & Assert
      expect(() => new UuidId(value)).toThrow(ValidationError)
    })

    it('should throw ValidationError when UUID with wrong length is provided', () => {
      // Arrange
      const value = '550e8400-e29b-41d4-a716-44665544000'

      // Act & Assert
      expect(() => new UuidId(value)).toThrow(ValidationError)
    })
  })

  describe('create', () => {
    it('should return success result when valid UUID is provided', () => {
      // Arrange
      const value = '550e8400-e29b-41d4-a716-446655440000'

      // Act
      const result = UuidId.create(value)

      // Assert
      expect(result.isSuccess).toBe(true)
      if (result.isSuccess) {
        expect(result.value.value).toBe(value)
      }
    })

    it('should return failure result when invalid UUID is provided', () => {
      // Arrange
      const value = 'invalid-uuid'

      // Act
      const result = UuidId.create(value)

      // Assert
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })
  })

  describe('generate', () => {
    it('should generate a valid UUID v4', () => {
      // Act
      const id = UuidId.generate()

      // Assert
      expect(id).toBeInstanceOf(UuidId)
      expect(id.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it('should generate different UUIDs on multiple calls', () => {
      // Act
      const id1 = UuidId.generate()
      const id2 = UuidId.generate()

      // Assert
      expect(id1.value).not.toBe(id2.value)
    })
  })

  describe('equals', () => {
    it('should return true when comparing equal UuidIds', () => {
      // Arrange
      const value = '550e8400-e29b-41d4-a716-446655440000'
      const id1 = new UuidId(value)
      const id2 = new UuidId(value)

      // Act
      const result = id1.equals(id2)

      // Assert
      expect(result).toBe(true)
    })

    it('should return false when comparing different UuidIds', () => {
      // Arrange
      const id1 = new UuidId('550e8400-e29b-41d4-a716-446655440000')
      const id2 = new UuidId('550e8400-e29b-41d4-a716-446655440001')

      // Act
      const result = id1.equals(id2)

      // Assert
      expect(result).toBe(false)
    })
  })
})

describe('IdFactory', () => {
  describe('create', () => {
    it('should create StringId when type is string', () => {
      // Arrange
      const value = 'test-id'

      // Act
      const result = IdFactory.create('string', value)

      // Assert
      expect(result.isSuccess).toBe(true)
      if (result.isSuccess) {
        expect(result.value).toBeInstanceOf(StringId)
        expect(result.value.value).toBe(value)
      }
    })

    it('should create NumberId when type is number', () => {
      // Arrange
      const value = 123

      // Act
      const result = IdFactory.create('number', value)

      // Assert
      expect(result.isSuccess).toBe(true)
      if (result.isSuccess) {
        expect(result.value).toBeInstanceOf(NumberId)
        expect(result.value.value).toBe(value)
      }
    })

    it('should create UuidId when type is uuid', () => {
      // Arrange
      const value = '550e8400-e29b-41d4-a716-446655440000'

      // Act
      const result = IdFactory.create('uuid', value)

      // Assert
      expect(result.isSuccess).toBe(true)
      if (result.isSuccess) {
        expect(result.value).toBeInstanceOf(UuidId)
        expect(result.value.value).toBe(value)
      }
    })

    it('should return failure when unsupported type is provided', () => {
      // Arrange
      const value = 'test'
      const type = 'unsupported' as any

      // Act
      const result = IdFactory.create(type, value)

      // Assert
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })

    it('should return failure when invalid value is provided for string type', () => {
      // Arrange
      const value = ''
      const type = 'string'

      // Act
      const result = IdFactory.create(type, value)

      // Assert
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })

    it('should return failure when invalid value is provided for number type', () => {
      // Arrange
      const value = -1
      const type = 'number'

      // Act
      const result = IdFactory.create(type, value)

      // Assert
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })

    it('should return failure when invalid value is provided for uuid type', () => {
      // Arrange
      const value = 'invalid-uuid'
      const type = 'uuid'

      // Act
      const result = IdFactory.create(type, value)

      // Assert
      expect(result.isFailure).toBe(true)
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(ValidationError)
      }
    })
  })

  describe('generate', () => {
    it('should generate StringId when type is string', () => {
      // Act
      const id = IdFactory.generate('string')

      // Assert
      expect(id).toBeInstanceOf(StringId)
      expect(id.value).toBeDefined()
      expect(typeof id.value).toBe('string')
    })

    it('should generate UuidId when type is uuid', () => {
      // Act
      const id = IdFactory.generate('uuid')

      // Assert
      expect(id).toBeInstanceOf(UuidId)
      expect(id.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it('should throw error when trying to generate number type', () => {
      // Act & Assert
      expect(() => IdFactory.generate('number' as any)).toThrow(ValidationError)
    })

    it('should throw error when unsupported type is provided', () => {
      // Act & Assert
      expect(() => IdFactory.generate('unsupported' as any)).toThrow(ValidationError)
    })
  })
})
