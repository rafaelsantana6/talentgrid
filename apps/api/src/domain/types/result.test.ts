import { describe, it, expect, vi } from 'vitest'
import { Result, Either, Maybe, ValidationError, DomainError } from '../index'

describe('Result', () => {
  describe('success', () => {
    it('should create a successful result when valid value is provided', () => {
      // Arrange
      const value = 'test value'

      // Act
      const result = Result.success(value)

      // Assert
      expect(result.isSuccess).toBe(true)
      expect(result.isFailure).toBe(false)
      expect(result.value).toBe(value)
    })

    it('should create a successful result with null value', () => {
      // Arrange
      const value = null

      // Act
      const result = Result.success(value)

      // Assert
      expect(result.isSuccess).toBe(true)
      expect(result.isFailure).toBe(false)
      expect(result.value).toBe(null)
    })

    it('should create a successful result with undefined value', () => {
      // Arrange
      const value = undefined

      // Act
      const result = Result.success(value)

      // Assert
      expect(result.isSuccess).toBe(true)
      expect(result.isFailure).toBe(false)
      expect(result.value).toBe(undefined)
    })
  })

  describe('failure', () => {
    it('should create a failed result when error is provided', () => {
      // Arrange
      const error = new Error('Test error')

      // Act
      const result = Result.failure(error)

      // Assert
      expect(result.isSuccess).toBe(false)
      expect(result.isFailure).toBe(true)
      expect(result.error).toBe(error)
    })

    it('should create a failed result with ValidationError', () => {
      // Arrange
      const error = new ValidationError('Invalid input', 'field', 'value')

      // Act
      const result = Result.failure(error)

      // Assert
      expect(result.isSuccess).toBe(false)
      expect(result.isFailure).toBe(true)
      expect(result.error).toBe(error)
    })
  })

  describe('map', () => {
    it('should transform successful result value', () => {
      // Arrange
      const result = Result.success(5)
      const transformFn = (value: number) => value * 2

      // Act
      const mappedResult = result.map(transformFn)

      // Assert
      expect(mappedResult.isSuccess).toBe(true)
      expect(mappedResult.value).toBe(10)
    })

    it('should not transform failed result', () => {
      // Arrange
      const result = Result.failure(new Error('Test error'))
      const transformFn = (value: number) => value * 2

      // Act
      const mappedResult = result.map(transformFn)

      // Assert
      expect(mappedResult.isFailure).toBe(true)
      expect(mappedResult.error).toBeInstanceOf(Error)
    })

    it('should handle transformation errors', () => {
      // Arrange
      const result = Result.success(5)
      const transformFn = (value: number) => {
        throw new Error('Transformation error')
      }

      // Act
      const mappedResult = result.map(transformFn)

      // Assert
      expect(mappedResult.isFailure).toBe(true)
      expect(mappedResult.error).toBeInstanceOf(Error)
    })
  })

  describe('mapError', () => {
    it('should transform failed result error', () => {
      // Arrange
      const result = Result.failure(new Error('Original error'))
      const transformFn = (error: Error) => new ValidationError('Mapped error', 'field')

      // Act
      const mappedResult = result.mapError(transformFn)

      // Assert
      expect(mappedResult.isFailure).toBe(true)
      expect(mappedResult.error).toBeInstanceOf(ValidationError)
    })

    it('should not transform successful result', () => {
      // Arrange
      const result = Result.success('test')
      const transformFn = (error: Error) => new ValidationError('Mapped error', 'field')

      // Act
      const mappedResult = result.mapError(transformFn)

      // Assert
      expect(mappedResult.isSuccess).toBe(true)
      expect(mappedResult.value).toBe('test')
    })
  })

  describe('flatMap', () => {
    it('should chain successful results', () => {
      // Arrange
      const result = Result.success(5)
      const chainFn = (value: number) => Result.success(value * 2)

      // Act
      const chainedResult = result.flatMap(chainFn)

      // Assert
      expect(chainedResult.isSuccess).toBe(true)
      expect(chainedResult.value).toBe(10)
    })

    it('should propagate failure in chain', () => {
      // Arrange
      const result = Result.failure(new Error('Original error'))
      const chainFn = (value: number) => Result.success(value * 2)

      // Act
      const chainedResult = result.flatMap(chainFn)

      // Assert
      expect(chainedResult.isFailure).toBe(true)
      expect(chainedResult.error).toBeInstanceOf(Error)
    })

    it('should handle failure in chain function', () => {
      // Arrange
      const result = Result.success(5)
      const chainFn = (value: number) => Result.failure(new Error('Chain error'))

      // Act
      const chainedResult = result.flatMap(chainFn)

      // Assert
      expect(chainedResult.isFailure).toBe(true)
      expect(chainedResult.error).toBeInstanceOf(Error)
    })
  })

  describe('onSuccess', () => {
    it('should execute callback for successful result', () => {
      // Arrange
      const result = Result.success('test')
      const callback = vi.fn()

      // Act
      const returnedResult = result.onSuccess(callback)

      // Assert
      expect(callback).toHaveBeenCalledWith('test')
      expect(returnedResult).toBe(result)
    })

    it('should not execute callback for failed result', () => {
      // Arrange
      const result = Result.failure(new Error('Test error'))
      const callback = vi.fn()

      // Act
      const returnedResult = result.onSuccess(callback)

      // Assert
      expect(callback).not.toHaveBeenCalled()
      expect(returnedResult).toBe(result)
    })
  })

  describe('onFailure', () => {
    it('should execute callback for failed result', () => {
      // Arrange
      const result = Result.failure(new Error('Test error'))
      const callback = vi.fn()

      // Act
      const returnedResult = result.onFailure(callback)

      // Assert
      expect(callback).toHaveBeenCalledWith(expect.any(Error))
      expect(returnedResult).toBe(result)
    })

    it('should not execute callback for successful result', () => {
      // Arrange
      const result = Result.success('test')
      const callback = vi.fn()

      // Act
      const returnedResult = result.onFailure(callback)

      // Assert
      expect(callback).not.toHaveBeenCalled()
      expect(returnedResult).toBe(result)
    })
  })

  describe('getOrElse', () => {
    it('should return value for successful result', () => {
      // Arrange
      const result = Result.success('test')
      const defaultValue = 'default'

      // Act
      const value = result.getOrElse(defaultValue)

      // Assert
      expect(value).toBe('test')
    })

    it('should return default value for failed result', () => {
      // Arrange
      const result = Result.failure(new Error('Test error'))
      const defaultValue = 'default'

      // Act
      const value = result.getOrElse(defaultValue)

      // Assert
      expect(value).toBe(defaultValue)
    })
  })

  describe('getOrElseGet', () => {
    it('should return value for successful result', () => {
      // Arrange
      const result = Result.success('test')
      const defaultValueFn = () => 'default'

      // Act
      const value = result.getOrElseGet(defaultValueFn)

      // Assert
      expect(value).toBe('test')
    })

    it('should execute function and return result for failed result', () => {
      // Arrange
      const result = Result.failure(new Error('Test error'))
      const defaultValueFn = () => 'default'

      // Act
      const value = result.getOrElseGet(defaultValueFn)

      // Assert
      expect(value).toBe('default')
    })
  })

  describe('combine', () => {
    it('should combine multiple successful results', () => {
      // Arrange
      const results = [
        Result.success(1),
        Result.success(2),
        Result.success(3),
      ]

      // Act
      const combined = Result.combine(results)

      // Assert
      expect(combined.isSuccess).toBe(true)
      if (combined.isSuccess) {
        expect(combined.value).toEqual([1, 2, 3])
      }
    })

    it('should fail when any result fails', () => {
      // Arrange
      const results = [
        Result.success(1),
        Result.failure(new Error('Error 1')),
        Result.success(3),
        Result.failure(new Error('Error 2')),
      ]

      // Act
      const combined = Result.combine(results)

      // Assert
      expect(combined.isFailure).toBe(true)
      if (combined.isFailure) {
        expect(combined.error.message).toContain('Error 1')
        expect(combined.error.message).toContain('Error 2')
      }
    })

    it('should handle empty array', () => {
      // Arrange
      const results: Result<unknown>[] = []

      // Act
      const combined = Result.combine(results)

      // Assert
      expect(combined.isSuccess).toBe(true)
      if (combined.isSuccess) {
        expect(combined.value).toEqual([])
      }
    })
  })

  describe('error handling', () => {
    it('should throw error when accessing value of failed result', () => {
      // Arrange
      const result = Result.failure(new Error('Test error'))

      // Act & Assert
      expect(() => result.value).toThrow('Cannot get value from failed result')
    })

    it('should throw error when accessing error of successful result', () => {
      // Arrange
      const result = Result.success('test')

      // Act & Assert
      expect(() => result.error).toThrow('Cannot get error from successful result')
    })
  })
})
