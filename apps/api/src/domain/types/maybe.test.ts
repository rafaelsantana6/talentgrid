import { describe, it, expect } from 'vitest'
import { Maybe } from '../index'

describe('Maybe', () => {
  describe('some', () => {
    it('should create a Some Maybe with valid value', () => {
      // Arrange
      const value = 'test value'

      // Act
      const maybe = Maybe.some(value)

      // Assert
      expect(maybe.isSome).toBe(true)
      expect(maybe.isNone).toBe(false)
      expect(maybe.value).toBe(value)
    })

    it('should create a Some Maybe with zero value', () => {
      // Arrange
      const value = 0

      // Act
      const maybe = Maybe.some(value)

      // Assert
      expect(maybe.isSome).toBe(true)
      expect(maybe.isNone).toBe(false)
      expect(maybe.value).toBe(0)
    })

    it('should create a Some Maybe with false value', () => {
      // Arrange
      const value = false

      // Act
      const maybe = Maybe.some(value)

      // Assert
      expect(maybe.isSome).toBe(true)
      expect(maybe.isNone).toBe(false)
      expect(maybe.value).toBe(false)
    })

    it('should create a Some Maybe with empty string', () => {
      // Arrange
      const value = ''

      // Act
      const maybe = Maybe.some(value)

      // Assert
      expect(maybe.isSome).toBe(true)
      expect(maybe.isNone).toBe(false)
      expect(maybe.value).toBe('')
    })

    it('should throw error when creating Some with null', () => {
      // Arrange
      const value = null

      // Act & Assert
      expect(() => Maybe.some(value)).toThrow('Maybe.some() cannot accept null or undefined')
    })

    it('should throw error when creating Some with undefined', () => {
      // Arrange
      const value = undefined

      // Act & Assert
      expect(() => Maybe.some(value)).toThrow('Maybe.some() cannot accept null or undefined')
    })
  })

  describe('none', () => {
    it('should create a None Maybe', () => {
      // Act
      const maybe = Maybe.none<string>()

      // Assert
      expect(maybe.isSome).toBe(false)
      expect(maybe.isNone).toBe(true)
    })
  })

  describe('fromNullable', () => {
    it('should create Some from valid value', () => {
      // Arrange
      const value = 'test'

      // Act
      const maybe = Maybe.fromNullable(value)

      // Assert
      expect(maybe.isSome).toBe(true)
      expect(maybe.value).toBe(value)
    })

    it('should create None from null', () => {
      // Arrange
      const value = null

      // Act
      const maybe = Maybe.fromNullable(value)

      // Assert
      expect(maybe.isNone).toBe(true)
    })

    it('should create None from undefined', () => {
      // Arrange
      const value = undefined

      // Act
      const maybe = Maybe.fromNullable(value)

      // Assert
      expect(maybe.isNone).toBe(true)
    })

    it('should create Some from zero', () => {
      // Arrange
      const value = 0

      // Act
      const maybe = Maybe.fromNullable(value)

      // Assert
      expect(maybe.isSome).toBe(true)
      expect(maybe.value).toBe(0)
    })

    it('should create Some from false', () => {
      // Arrange
      const value = false

      // Act
      const maybe = Maybe.fromNullable(value)

      // Assert
      expect(maybe.isSome).toBe(true)
      expect(maybe.value).toBe(false)
    })
  })

  describe('map', () => {
    it('should transform Some value', () => {
      // Arrange
      const maybe = Maybe.some(5)
      const transformFn = (value: number) => value * 2

      // Act
      const mappedMaybe = maybe.map(transformFn)

      // Assert
      expect(mappedMaybe.isSome).toBe(true)
      if (mappedMaybe.isSome) {
        expect(mappedMaybe.value).toBe(10)
      }
    })

    it('should not transform None', () => {
      // Arrange
      const maybe = Maybe.none<number>()
      const transformFn = (value: number) => value * 2

      // Act
      const mappedMaybe = maybe.map(transformFn)

      // Assert
      expect(mappedMaybe.isNone).toBe(true)
    })

    it('should handle transformation errors', () => {
      // Arrange
      const maybe = Maybe.some(5)
      const transformFn = (value: number) => {
        throw new Error('Transformation error')
      }

      // Act
      const mappedMaybe = maybe.map(transformFn)

      // Assert
      expect(mappedMaybe.isNone).toBe(true)
    })
  })

  describe('flatMap', () => {
    it('should chain Some values', () => {
      // Arrange
      const maybe = Maybe.some(5)
      const chainFn = (value: number) => Maybe.some(value * 2)

      // Act
      const chainedMaybe = maybe.flatMap(chainFn)

      // Assert
      expect(chainedMaybe.isSome).toBe(true)
      if (chainedMaybe.isSome) {
        expect(chainedMaybe.value).toBe(10)
      }
    })

    it('should propagate None', () => {
      // Arrange
      const maybe = Maybe.none<number>()
      const chainFn = (value: number) => Maybe.some(value * 2)

      // Act
      const chainedMaybe = maybe.flatMap(chainFn)

      // Assert
      expect(chainedMaybe.isNone).toBe(true)
    })

    it('should handle None from chain function', () => {
      // Arrange
      const maybe = Maybe.some(5)
      const chainFn = (value: number) => Maybe.none<number>()

      // Act
      const chainedMaybe = maybe.flatMap(chainFn)

      // Assert
      expect(chainedMaybe.isNone).toBe(true)
    })
  })

  describe('filter', () => {
    it('should return Some when predicate is true', () => {
      // Arrange
      const maybe = Maybe.some(5)
      const predicate = (value: number) => value > 0

      // Act
      const filteredMaybe = maybe.filter(predicate)

      // Assert
      expect(filteredMaybe.isSome).toBe(true)
      if (filteredMaybe.isSome) {
        expect(filteredMaybe.value).toBe(5)
      }
    })

    it('should return None when predicate is false', () => {
      // Arrange
      const maybe = Maybe.some(5)
      const predicate = (value: number) => value < 0

      // Act
      const filteredMaybe = maybe.filter(predicate)

      // Assert
      expect(filteredMaybe.isNone).toBe(true)
    })

    it('should return None when filtering None', () => {
      // Arrange
      const maybe = Maybe.none<number>()
      const predicate = (value: number) => value > 0

      // Act
      const filteredMaybe = maybe.filter(predicate)

      // Assert
      expect(filteredMaybe.isNone).toBe(true)
    })
  })

  describe('getOrElse', () => {
    it('should return value for Some', () => {
      // Arrange
      const maybe = Maybe.some('test')
      const defaultValue = 'default'

      // Act
      const value = maybe.getOrElse(defaultValue)

      // Assert
      expect(value).toBe('test')
    })

    it('should return default value for None', () => {
      // Arrange
      const maybe = Maybe.none<string>()
      const defaultValue = 'default'

      // Act
      const value = maybe.getOrElse(defaultValue)

      // Assert
      expect(value).toBe(defaultValue)
    })
  })

  describe('getOrElseGet', () => {
    it('should return value for Some', () => {
      // Arrange
      const maybe = Maybe.some('test')
      const defaultValueFn = () => 'default'

      // Act
      const value = maybe.getOrElseGet(defaultValueFn)

      // Assert
      expect(value).toBe('test')
    })

    it('should execute function and return result for None', () => {
      // Arrange
      const maybe = Maybe.none<string>()
      const defaultValueFn = () => 'default'

      // Act
      const value = maybe.getOrElseGet(defaultValueFn)

      // Assert
      expect(value).toBe('default')
    })
  })

  describe('orElse', () => {
    it('should return original Some', () => {
      // Arrange
      const maybe = Maybe.some('original')
      const otherMaybe = Maybe.some('other')

      // Act
      const result = maybe.orElse(otherMaybe)

      // Assert
      expect(result.isSome).toBe(true)
      if (result.isSome) {
        expect(result.value).toBe('original')
      }
    })

    it('should return other Maybe when original is None', () => {
      // Arrange
      const maybe = Maybe.none<string>()
      const otherMaybe = Maybe.some('other')

      // Act
      const result = maybe.orElse(otherMaybe)

      // Assert
      expect(result.isSome).toBe(true)
      if (result.isSome) {
        expect(result.value).toBe('other')
      }
    })

    it('should return None when both are None', () => {
      // Arrange
      const maybe = Maybe.none<string>()
      const otherMaybe = Maybe.none<string>()

      // Act
      const result = maybe.orElse(otherMaybe)

      // Assert
      expect(result.isNone).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should throw error when accessing value of None', () => {
      // Arrange
      const maybe = Maybe.none<string>()

      // Act & Assert
      expect(() => maybe.value).toThrow('Cannot get value from None')
    })
  })

  describe('edge cases', () => {
    it('should handle complex objects', () => {
      // Arrange
      const complexObject = { id: 1, name: 'test', nested: { value: true } }
      const maybe = Maybe.some(complexObject)

      // Act
      const mappedMaybe = maybe.map(obj => ({ ...obj, id: obj.id * 2 }))

      // Assert
      expect(mappedMaybe.isSome).toBe(true)
      if (mappedMaybe.isSome) {
        expect(mappedMaybe.value).toEqual({
          id: 2,
          name: 'test',
          nested: { value: true }
        })
      }
    })

    it('should handle arrays', () => {
      // Arrange
      const array = [1, 2, 3]
      const maybe = Maybe.some(array)

      // Act
      const mappedMaybe = maybe.map(arr => arr.map(x => x * 2))

      // Assert
      expect(mappedMaybe.isSome).toBe(true)
      if (mappedMaybe.isSome) {
        expect(mappedMaybe.value).toEqual([2, 4, 6])
      }
    })

    it('should handle functions as values', () => {
      // Arrange
      const fn = (x: number) => x * 2
      const maybe = Maybe.some(fn)

      // Act
      const mappedMaybe = maybe.map(f => f(5))

      // Assert
      expect(mappedMaybe.isSome).toBe(true)
      if (mappedMaybe.isSome) {
        expect(mappedMaybe.value).toBe(10)
      }
    })

    it('should handle chaining multiple operations', () => {
      // Arrange
      const maybe = Maybe.some('  hello world  ')

      // Act
      const result = maybe
        .map(str => str.trim())
        .map(str => str.toUpperCase())
        .map(str => str.split(' '))
        .map(words => words.join('-'))

      // Assert
      expect(result.isSome).toBe(true)
      if (result.isSome) {
        expect(result.value).toBe('HELLO-WORLD')
      }
    })
  })
})
