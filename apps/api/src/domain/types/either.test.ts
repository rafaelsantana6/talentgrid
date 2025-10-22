import { describe, expect, it } from 'vitest'

import { Either } from '../index'

describe('Either', () => {
  describe('left', () => {
    it('should create a left Either with value', () => {
      // Arrange
      const value = 'error message'

      // Act
      const either = Either.left(value)

      // Assert
      expect(either.isLeft).toBe(true)
      expect(either.isRight).toBe(false)
      expect(either.left).toBe(value)
    })

    it('should create a left Either with null value', () => {
      // Arrange
      const value = null

      // Act
      const either = Either.left(value)

      // Assert
      expect(either.isLeft).toBe(true)
      expect(either.isRight).toBe(false)
      expect(either.left).toBe(null)
    })
  })

  describe('right', () => {
    it('should create a right Either with value', () => {
      // Arrange
      const value = 'success value'

      // Act
      const either = Either.right(value)

      // Assert
      expect(either.isLeft).toBe(false)
      expect(either.isRight).toBe(true)
      expect(either.right).toBe(value)
    })

    it('should create a right Either with null value', () => {
      // Arrange
      const value = null

      // Act
      const either = Either.right(value)

      // Assert
      expect(either.isLeft).toBe(false)
      expect(either.isRight).toBe(true)
      expect(either.right).toBe(null)
    })
  })

  describe('map', () => {
    it('should transform right value', () => {
      // Arrange
      const either = Either.right(5)
      const transformFn = (value: number) => value * 2

      // Act
      const mappedEither = either.map(transformFn)

      // Assert
      expect(mappedEither.isRight).toBe(true)
      if (mappedEither.isRight) {
        expect(mappedEither.right).toBe(10)
      }
    })

    it('should not transform left value', () => {
      // Arrange
      const either = Either.left('error')
      const transformFn = (value: number) => value * 2

      // Act
      const mappedEither = either.map(transformFn)

      // Assert
      expect(mappedEither.isLeft).toBe(true)
      if (mappedEither.isLeft) {
        expect(mappedEither.left).toBe('error')
      }
    })

    it('should handle transformation errors', () => {
      // Arrange
      const either = Either.right(5)
      const transformFn = (value: number) => {
        throw new Error('Transformation error')
      }

      // Act
      const mappedEither = either.map(transformFn)

      // Assert
      expect(mappedEither.isLeft).toBe(true)
      if (mappedEither.isLeft) {
        expect(mappedEither.left).toBeInstanceOf(Error)
      }
    })
  })

  describe('mapLeft', () => {
    it('should transform left value', () => {
      // Arrange
      const either = Either.left('original error')
      const transformFn = (error: string) => `Mapped: ${error}`

      // Act
      const mappedEither = either.mapLeft(transformFn)

      // Assert
      expect(mappedEither.isLeft).toBe(true)
      if (mappedEither.isLeft) {
        expect(mappedEither.left).toBe('Mapped: original error')
      }
    })

    it('should not transform right value', () => {
      // Arrange
      const either = Either.right('success')
      const transformFn = (error: string) => `Mapped: ${error}`

      // Act
      const mappedEither = either.mapLeft(transformFn)

      // Assert
      expect(mappedEither.isRight).toBe(true)
      if (mappedEither.isRight) {
        expect(mappedEither.right).toBe('success')
      }
    })

    it('should handle transformation errors', () => {
      // Arrange
      const either = Either.left('error')
      const transformFn = (error: string) => {
        throw new Error('Transformation error')
      }

      // Act
      const mappedEither = either.mapLeft(transformFn)

      // Assert
      expect(mappedEither.isLeft).toBe(true)
      if (mappedEither.isLeft) {
        expect(mappedEither.left).toBeInstanceOf(Error)
      }
    })
  })

  describe('flatMap', () => {
    it('should chain right values', () => {
      // Arrange
      const either = Either.right(5)
      const chainFn = (value: number) => Either.right(value * 2)

      // Act
      const chainedEither = either.flatMap(chainFn)

      // Assert
      expect(chainedEither.isRight).toBe(true)
      if (chainedEither.isRight) {
        expect(chainedEither.right).toBe(10)
      }
    })

    it('should propagate left value', () => {
      // Arrange
      const either = Either.left('original error')
      const chainFn = (value: number) => Either.right(value * 2)

      // Act
      const chainedEither = either.flatMap(chainFn)

      // Assert
      expect(chainedEither.isLeft).toBe(true)
      if (chainedEither.isLeft) {
        expect(chainedEither.left).toBe('original error')
      }
    })

    it('should handle left value from chain function', () => {
      // Arrange
      const either = Either.right(5)
      const chainFn = (value: number) => Either.left('chain error')

      // Act
      const chainedEither = either.flatMap(chainFn)

      // Assert
      expect(chainedEither.isLeft).toBe(true)
      if (chainedEither.isLeft) {
        expect(chainedEither.left).toBe('chain error')
      }
    })
  })

  describe('fold', () => {
    it('should execute left function for left Either', () => {
      // Arrange
      const either = Either.left('error')
      const leftFn = (error: string) => `Left: ${error}`
      const rightFn = (value: string) => `Right: ${value}`

      // Act
      const result = either.fold(leftFn, rightFn)

      // Assert
      expect(result).toBe('Left: error')
    })

    it('should execute right function for right Either', () => {
      // Arrange
      const either = Either.right('success')
      const leftFn = (error: string) => `Left: ${error}`
      const rightFn = (value: string) => `Right: ${value}`

      // Act
      const result = either.fold(leftFn, rightFn)

      // Assert
      expect(result).toBe('Right: success')
    })

    it('should handle different return types', () => {
      // Arrange
      const either = Either.left(404)
      const leftFn = (error: number) => error
      const rightFn = (value: string) => value.length

      // Act
      const result = either.fold(leftFn, rightFn)

      // Assert
      expect(result).toBe(404)
    })
  })

  describe('error handling', () => {
    it('should throw error when accessing right value of left Either', () => {
      // Arrange
      const either = Either.left('error')

      // Act & Assert
      expect(() => either.right).toThrow('Cannot get right value from left Either')
    })

    it('should throw error when accessing left value of right Either', () => {
      // Arrange
      const either = Either.right('success')

      // Act & Assert
      expect(() => either.left).toThrow('Cannot get left value from right Either')
    })
  })

  describe('edge cases', () => {
    it('should handle undefined values', () => {
      // Arrange
      const leftEither = Either.left(undefined)
      const rightEither = Either.right(undefined)

      // Act & Assert
      expect(leftEither.isLeft).toBe(true)
      expect(leftEither.left).toBe(undefined)
      expect(rightEither.isRight).toBe(true)
      expect(rightEither.right).toBe(undefined)
    })

    it('should handle complex objects', () => {
      // Arrange
      const complexObject = { id: 1, name: 'test', nested: { value: true } }
      const either = Either.right(complexObject)

      // Act
      const mappedEither = either.map((obj) => ({ ...obj, id: obj.id * 2 }))

      // Assert
      expect(mappedEither.isRight).toBe(true)
      if (mappedEither.isRight) {
        expect(mappedEither.right).toEqual({
          id: 2,
          name: 'test',
          nested: { value: true },
        })
      }
    })

    it('should handle functions as values', () => {
      // Arrange
      const fn = (x: number) => x * 2
      const either = Either.right(fn)

      // Act
      const mappedEither = either.map((f) => f(5))

      // Assert
      expect(mappedEither.isRight).toBe(true)
      if (mappedEither.isRight) {
        expect(mappedEither.right).toBe(10)
      }
    })
  })
})
