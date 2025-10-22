import { describe, it, expect } from 'vitest'
import { 
  BaseValidator, 
  StringValidator, 
  NumberValidator, 
  ArrayValidator, 
  ObjectValidator, 
  RequiredValidator, 
  OptionalValidator, 
  EnumValidator, 
  DateValidator,
  ValidationError 
} from '../index'

describe('StringValidator', () => {
  describe('notEmpty', () => {
    it('should return null when valid non-empty string is provided', () => {
      // Arrange
      const validator = StringValidator.notEmpty('name')
      const value = 'John Doe'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when null is provided', () => {
      // Arrange
      const validator = StringValidator.notEmpty('name')
      const value = null

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('name')
    })

    it('should return ValidationError when undefined is provided', () => {
      // Arrange
      const validator = StringValidator.notEmpty('name')
      const value = undefined

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('name')
    })

    it('should return ValidationError when non-string is provided', () => {
      // Arrange
      const validator = StringValidator.notEmpty('name')
      const value = 123

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('name')
    })

    it('should return ValidationError when empty string is provided', () => {
      // Arrange
      const validator = StringValidator.notEmpty('name')
      const value = ''

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('name')
    })

    it('should return ValidationError when whitespace-only string is provided', () => {
      // Arrange
      const validator = StringValidator.notEmpty('name')
      const value = '   '

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('name')
    })
  })

  describe('minLength', () => {
    it('should return null when string meets minimum length', () => {
      // Arrange
      const validator = StringValidator.minLength(3, 'name')
      const value = 'John'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when string equals minimum length', () => {
      // Arrange
      const validator = StringValidator.minLength(3, 'name')
      const value = 'Jon'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when string is shorter than minimum', () => {
      // Arrange
      const validator = StringValidator.minLength(3, 'name')
      const value = 'Jo'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('name')
    })

    it('should return ValidationError when non-string is provided', () => {
      // Arrange
      const validator = StringValidator.minLength(3, 'name')
      const value = 123

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('name')
    })
  })

  describe('maxLength', () => {
    it('should return null when string is within maximum length', () => {
      // Arrange
      const validator = StringValidator.maxLength(10, 'name')
      const value = 'John'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when string equals maximum length', () => {
      // Arrange
      const validator = StringValidator.maxLength(4, 'name')
      const value = 'John'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when string exceeds maximum length', () => {
      // Arrange
      const validator = StringValidator.maxLength(3, 'name')
      const value = 'John'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('name')
    })
  })

  describe('pattern', () => {
    it('should return null when string matches pattern', () => {
      // Arrange
      const validator = StringValidator.pattern(/^[A-Z]+$/, 'code')
      const value = 'ABC'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when string does not match pattern', () => {
      // Arrange
      const validator = StringValidator.pattern(/^[A-Z]+$/, 'code')
      const value = 'abc'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('code')
    })

    it('should return ValidationError when non-string is provided', () => {
      // Arrange
      const validator = StringValidator.pattern(/^[A-Z]+$/, 'code')
      const value = 123

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('code')
    })

    it('should use custom message when provided', () => {
      // Arrange
      const validator = StringValidator.pattern(/^[A-Z]+$/, 'code', 'Must be uppercase letters only')
      const value = 'abc'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.message).toBe('Must be uppercase letters only')
    })
  })

  describe('email', () => {
    it('should return null when valid email is provided', () => {
      // Arrange
      const validator = StringValidator.email('email')
      const value = 'test@example.com'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when email with subdomain is provided', () => {
      // Arrange
      const validator = StringValidator.email('email')
      const value = 'test@sub.example.com'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when invalid email is provided', () => {
      // Arrange
      const validator = StringValidator.email('email')
      const value = 'invalid-email'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('email')
    })

    it('should return ValidationError when email without domain is provided', () => {
      // Arrange
      const validator = StringValidator.email('email')
      const value = 'test@'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('email')
    })

    it('should return ValidationError when email without @ is provided', () => {
      // Arrange
      const validator = StringValidator.email('email')
      const value = 'testexample.com'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('email')
    })
  })
})

describe('NumberValidator', () => {
  describe('isNumber', () => {
    it('should return null when valid number is provided', () => {
      // Arrange
      const validator = NumberValidator.isNumber('age')
      const value = 25

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when zero is provided', () => {
      // Arrange
      const validator = NumberValidator.isNumber('age')
      const value = 0

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when negative number is provided', () => {
      // Arrange
      const validator = NumberValidator.isNumber('age')
      const value = -5

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when NaN is provided', () => {
      // Arrange
      const validator = NumberValidator.isNumber('age')
      const value = NaN

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('age')
    })

    it('should return ValidationError when non-number is provided', () => {
      // Arrange
      const validator = NumberValidator.isNumber('age')
      const value = '25'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('age')
    })
  })

  describe('positive', () => {
    it('should return null when positive number is provided', () => {
      // Arrange
      const validator = NumberValidator.positive('age')
      const value = 25

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when zero is provided', () => {
      // Arrange
      const validator = NumberValidator.positive('age')
      const value = 0

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('age')
    })

    it('should return ValidationError when negative number is provided', () => {
      // Arrange
      const validator = NumberValidator.positive('age')
      const value = -5

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('age')
    })
  })

  describe('min', () => {
    it('should return null when number meets minimum value', () => {
      // Arrange
      const validator = NumberValidator.min(18, 'age')
      const value = 25

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when number equals minimum value', () => {
      // Arrange
      const validator = NumberValidator.min(18, 'age')
      const value = 18

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when number is below minimum', () => {
      // Arrange
      const validator = NumberValidator.min(18, 'age')
      const value = 17

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('age')
    })
  })

  describe('max', () => {
    it('should return null when number is within maximum value', () => {
      // Arrange
      const validator = NumberValidator.max(100, 'age')
      const value = 50

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when number equals maximum value', () => {
      // Arrange
      const validator = NumberValidator.max(100, 'age')
      const value = 100

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when number exceeds maximum', () => {
      // Arrange
      const validator = NumberValidator.max(100, 'age')
      const value = 101

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('age')
    })
  })

  describe('integer', () => {
    it('should return null when integer is provided', () => {
      // Arrange
      const validator = NumberValidator.integer('count')
      const value = 5

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when decimal is provided', () => {
      // Arrange
      const validator = NumberValidator.integer('count')
      const value = 5.5

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('count')
    })
  })
})

describe('ArrayValidator', () => {
  describe('isArray', () => {
    it('should return null when array is provided', () => {
      // Arrange
      const validator = ArrayValidator.isArray('items')
      const value = [1, 2, 3]

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when empty array is provided', () => {
      // Arrange
      const validator = ArrayValidator.isArray('items')
      const value = []

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when non-array is provided', () => {
      // Arrange
      const validator = ArrayValidator.isArray('items')
      const value = 'not an array'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('items')
    })

    it('should return ValidationError when null is provided', () => {
      // Arrange
      const validator = ArrayValidator.isArray('items')
      const value = null

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('items')
    })
  })

  describe('notEmpty', () => {
    it('should return null when non-empty array is provided', () => {
      // Arrange
      const validator = ArrayValidator.notEmpty('items')
      const value = [1, 2, 3]

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when empty array is provided', () => {
      // Arrange
      const validator = ArrayValidator.notEmpty('items')
      const value = []

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('items')
    })

    it('should return ValidationError when non-array is provided', () => {
      // Arrange
      const validator = ArrayValidator.notEmpty('items')
      const value = 'not an array'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('items')
    })
  })

  describe('minLength', () => {
    it('should return null when array meets minimum length', () => {
      // Arrange
      const validator = ArrayValidator.minLength(2, 'items')
      const value = [1, 2, 3]

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when array equals minimum length', () => {
      // Arrange
      const validator = ArrayValidator.minLength(2, 'items')
      const value = [1, 2]

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when array is shorter than minimum', () => {
      // Arrange
      const validator = ArrayValidator.minLength(2, 'items')
      const value = [1]

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('items')
    })
  })

  describe('maxLength', () => {
    it('should return null when array is within maximum length', () => {
      // Arrange
      const validator = ArrayValidator.maxLength(5, 'items')
      const value = [1, 2, 3]

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when array equals maximum length', () => {
      // Arrange
      const validator = ArrayValidator.maxLength(3, 'items')
      const value = [1, 2, 3]

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when array exceeds maximum length', () => {
      // Arrange
      const validator = ArrayValidator.maxLength(2, 'items')
      const value = [1, 2, 3]

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('items')
    })
  })
})

describe('ObjectValidator', () => {
  describe('isObject', () => {
    it('should return null when object is provided', () => {
      // Arrange
      const validator = ObjectValidator.isObject('data')
      const value = { name: 'John' }

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when empty object is provided', () => {
      // Arrange
      const validator = ObjectValidator.isObject('data')
      const value = {}

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when null is provided', () => {
      // Arrange
      const validator = ObjectValidator.isObject('data')
      const value = null

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('data')
    })

    it('should return ValidationError when array is provided', () => {
      // Arrange
      const validator = ObjectValidator.isObject('data')
      const value = [1, 2, 3]

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('data')
    })

    it('should return ValidationError when primitive is provided', () => {
      // Arrange
      const validator = ObjectValidator.isObject('data')
      const value = 'string'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('data')
    })
  })

  describe('hasProperty', () => {
    it('should return null when object has required property', () => {
      // Arrange
      const validator = ObjectValidator.hasProperty('name', 'data')
      const value = { name: 'John', age: 25 }

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when object lacks required property', () => {
      // Arrange
      const validator = ObjectValidator.hasProperty('name', 'data')
      const value = { age: 25 }

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('data')
    })

    it('should return ValidationError when null is provided', () => {
      // Arrange
      const validator = ObjectValidator.hasProperty('name', 'data')
      const value = null

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('data')
    })
  })
})

describe('RequiredValidator', () => {
  describe('required', () => {
    it('should return null when non-null value is provided', () => {
      // Arrange
      const validator = RequiredValidator.required('field')
      const value = 'test'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when zero is provided', () => {
      // Arrange
      const validator = RequiredValidator.required('field')
      const value = 0

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when false is provided', () => {
      // Arrange
      const validator = RequiredValidator.required('field')
      const value = false

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when empty string is provided', () => {
      // Arrange
      const validator = RequiredValidator.required('field')
      const value = ''

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when null is provided', () => {
      // Arrange
      const validator = RequiredValidator.required('field')
      const value = null

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('field')
    })

    it('should return ValidationError when undefined is provided', () => {
      // Arrange
      const validator = RequiredValidator.required('field')
      const value = undefined

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('field')
    })
  })
})

describe('OptionalValidator', () => {
  describe('optional', () => {
    it('should return null when null is provided', () => {
      // Arrange
      const validator = OptionalValidator.optional(StringValidator.notEmpty('field'))
      const value = null

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when undefined is provided', () => {
      // Arrange
      const validator = OptionalValidator.optional(StringValidator.notEmpty('field'))
      const value = undefined

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should validate when non-null value is provided', () => {
      // Arrange
      const validator = OptionalValidator.optional(StringValidator.notEmpty('field'))
      const value = 'test'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return validation error when invalid non-null value is provided', () => {
      // Arrange
      const validator = OptionalValidator.optional(StringValidator.notEmpty('field'))
      const value = ''

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('field')
    })
  })
})

describe('EnumValidator', () => {
  describe('oneOf', () => {
    it('should return null when value is in allowed values', () => {
      // Arrange
      const validator = EnumValidator.oneOf(['red', 'green', 'blue'], 'color')
      const value = 'red'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when value is not in allowed values', () => {
      // Arrange
      const validator = EnumValidator.oneOf(['red', 'green', 'blue'], 'color')
      const value = 'yellow'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('color')
    })

    it('should work with numeric values', () => {
      // Arrange
      const validator = EnumValidator.oneOf([1, 2, 3], 'number')
      const value = 2

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should work with mixed types', () => {
      // Arrange
      const validator = EnumValidator.oneOf(['1', 2, true], 'mixed')
      const value = true

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })
  })
})

describe('DateValidator', () => {
  describe('isValidDate', () => {
    it('should return null when valid Date is provided', () => {
      // Arrange
      const validator = DateValidator.isValidDate('date')
      const value = new Date('2023-01-01')

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when invalid Date is provided', () => {
      // Arrange
      const validator = DateValidator.isValidDate('date')
      const value = new Date('invalid')

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('date')
    })

    it('should return ValidationError when non-Date is provided', () => {
      // Arrange
      const validator = DateValidator.isValidDate('date')
      const value = '2023-01-01'

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('date')
    })
  })

  describe('before', () => {
    it('should return null when date is before max date', () => {
      // Arrange
      const validator = DateValidator.before(new Date('2023-12-31'), 'date')
      const value = new Date('2023-06-01')

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when date is after max date', () => {
      // Arrange
      const validator = DateValidator.before(new Date('2023-06-01'), 'date')
      const value = new Date('2023-12-31')

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('date')
    })

    it('should return ValidationError when date equals max date', () => {
      // Arrange
      const maxDate = new Date('2023-06-01')
      const validator = DateValidator.before(maxDate, 'date')
      const value = new Date('2023-06-01')

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('date')
    })
  })

  describe('after', () => {
    it('should return null when date is after min date', () => {
      // Arrange
      const validator = DateValidator.after(new Date('2023-01-01'), 'date')
      const value = new Date('2023-06-01')

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeNull()
    })

    it('should return ValidationError when date is before min date', () => {
      // Arrange
      const validator = DateValidator.after(new Date('2023-06-01'), 'date')
      const value = new Date('2023-01-01')

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('date')
    })

    it('should return ValidationError when date equals min date', () => {
      // Arrange
      const minDate = new Date('2023-06-01')
      const validator = DateValidator.after(minDate, 'date')
      const value = new Date('2023-06-01')

      // Act
      const result = validator(value)

      // Assert
      expect(result).toBeInstanceOf(ValidationError)
      expect(result?.field).toBe('date')
    })
  })
})
