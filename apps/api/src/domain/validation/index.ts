import type { ValidationError as IValidationError, IValidator, IResult } from '../interfaces'
import { Result, ValidationError } from '../types'

/**
 * Classe base para validadores
 * @template T - Tipo do objeto a ser validado
 */
export abstract class BaseValidator<T> implements IValidator<T> {
  /**
   * Valida os dados de entrada
   */
  abstract validate(data: unknown): IResult<T, IValidationError[]>

  /**
   * Valida um campo específico
   */
  protected validateField(
    value: unknown,
    fieldName: string,
    validators: Array<(value: unknown) => ValidationError | null>
  ): ValidationError | null {
    for (const validator of validators) {
      const error = validator(value)
      if (error) {
        return error
      }
    }
    return null
  }

  /**
   * Combina múltiplos resultados de validação
   */
  protected combineResults(results: Result<unknown, ValidationError>[]): Result<T, IValidationError[]> {
    const errors: IValidationError[] = []

    for (const result of results) {
      if (result.isFailure) {
        errors.push(result.error as IValidationError)
      }
    }

    if (errors.length > 0) {
      return Result.failure(errors)
    }

    // Se chegou até aqui, todos os resultados foram bem-sucedidos
    // O tipo T será inferido pela implementação concreta
    return Result.success({} as T)
  }
}

/**
 * Validador para strings
 */
export class StringValidator {
  /**
   * Valida se o valor é uma string não vazia
   */
  static notEmpty(fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'string') {
        return new ValidationError(`${fieldName} must be a string`, fieldName, value)
      }
      if (value.trim().length === 0) {
        return new ValidationError(`${fieldName} cannot be empty`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida o comprimento mínimo da string
   */
  static minLength(minLength: number, fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'string') {
        return new ValidationError(`${fieldName} must be a string`, fieldName, value)
      }
      if (value.length < minLength) {
        return new ValidationError(`${fieldName} must be at least ${minLength} characters long`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida o comprimento máximo da string
   */
  static maxLength(maxLength: number, fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'string') {
        return new ValidationError(`${fieldName} must be a string`, fieldName, value)
      }
      if (value.length > maxLength) {
        return new ValidationError(`${fieldName} must be at most ${maxLength} characters long`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida se a string corresponde a um padrão regex
   */
  static pattern(regex: RegExp, fieldName: string, message?: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'string') {
        return new ValidationError(`${fieldName} must be a string`, fieldName, value)
      }
      if (!regex.test(value)) {
        return new ValidationError(message || `${fieldName} format is invalid`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida se a string é um email válido
   */
  static email(fieldName: string): (value: unknown) => ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return StringValidator.pattern(emailRegex, fieldName, `${fieldName} must be a valid email address`)
  }
}

/**
 * Validador para números
 */
export class NumberValidator {
  /**
   * Valida se o valor é um número
   */
  static isNumber(fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'number' || isNaN(value)) {
        return new ValidationError(`${fieldName} must be a valid number`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida se o número é positivo
   */
  static positive(fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'number' || isNaN(value)) {
        return new ValidationError(`${fieldName} must be a valid number`, fieldName, value)
      }
      if (value <= 0) {
        return new ValidationError(`${fieldName} must be positive`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida se o número é maior ou igual a um valor mínimo
   */
  static min(minValue: number, fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'number' || isNaN(value)) {
        return new ValidationError(`${fieldName} must be a valid number`, fieldName, value)
      }
      if (value < minValue) {
        return new ValidationError(`${fieldName} must be at least ${minValue}`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida se o número é menor ou igual a um valor máximo
   */
  static max(maxValue: number, fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'number' || isNaN(value)) {
        return new ValidationError(`${fieldName} must be a valid number`, fieldName, value)
      }
      if (value > maxValue) {
        return new ValidationError(`${fieldName} must be at most ${maxValue}`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida se o número é um inteiro
   */
  static integer(fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'number' || isNaN(value)) {
        return new ValidationError(`${fieldName} must be a valid number`, fieldName, value)
      }
      if (!Number.isInteger(value)) {
        return new ValidationError(`${fieldName} must be an integer`, fieldName, value)
      }
      return null
    }
  }
}

/**
 * Validador para arrays
 */
export class ArrayValidator {
  /**
   * Valida se o valor é um array
   */
  static isArray(fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (!Array.isArray(value)) {
        return new ValidationError(`${fieldName} must be an array`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida se o array não está vazio
   */
  static notEmpty(fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (!Array.isArray(value)) {
        return new ValidationError(`${fieldName} must be an array`, fieldName, value)
      }
      if (value.length === 0) {
        return new ValidationError(`${fieldName} cannot be empty`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida o comprimento mínimo do array
   */
  static minLength(minLength: number, fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (!Array.isArray(value)) {
        return new ValidationError(`${fieldName} must be an array`, fieldName, value)
      }
      if (value.length < minLength) {
        return new ValidationError(`${fieldName} must have at least ${minLength} items`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida o comprimento máximo do array
   */
  static maxLength(maxLength: number, fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (!Array.isArray(value)) {
        return new ValidationError(`${fieldName} must be an array`, fieldName, value)
      }
      if (value.length > maxLength) {
        return new ValidationError(`${fieldName} must have at most ${maxLength} items`, fieldName, value)
      }
      return null
    }
  }
}

/**
 * Validador para objetos
 */
export class ObjectValidator {
  /**
   * Valida se o valor é um objeto
   */
  static isObject(fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return new ValidationError(`${fieldName} must be an object`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida se o objeto tem uma propriedade específica
   */
  static hasProperty(propertyName: string, fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (typeof value !== 'object' || value === null) {
        return new ValidationError(`${fieldName} must be an object`, fieldName, value)
      }
      if (!(propertyName in value)) {
        return new ValidationError(`${fieldName} must have property '${propertyName}'`, fieldName, value)
      }
      return null
    }
  }
}

/**
 * Validador para valores obrigatórios
 */
export class RequiredValidator {
  /**
   * Valida se o valor não é null ou undefined
   */
  static required(fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (value === null || value === undefined) {
        return new ValidationError(`${fieldName} is required`, fieldName, value)
      }
      return null
    }
  }
}

/**
 * Validador para valores opcionais
 */
export class OptionalValidator {
  /**
   * Valida apenas se o valor não for null ou undefined
   */
  static optional<T>(validator: (value: unknown) => ValidationError | null): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (value === null || value === undefined) {
        return null // Valor opcional, não há erro
      }
      return validator(value)
    }
  }
}

/**
 * Validador para valores de enum
 */
export class EnumValidator {
  /**
   * Valida se o valor está em uma lista de valores permitidos
   */
  static oneOf(allowedValues: unknown[], fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (!allowedValues.includes(value)) {
        return new ValidationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`, fieldName, value)
      }
      return null
    }
  }
}

/**
 * Validador para datas
 */
export class DateValidator {
  /**
   * Valida se o valor é uma data válida
   */
  static isValidDate(fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        return new ValidationError(`${fieldName} must be a valid date`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida se a data é anterior a uma data específica
   */
  static before(maxDate: Date, fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        return new ValidationError(`${fieldName} must be a valid date`, fieldName, value)
      }
      if (value >= maxDate) {
        return new ValidationError(`${fieldName} must be before ${maxDate.toISOString()}`, fieldName, value)
      }
      return null
    }
  }

  /**
   * Valida se a data é posterior a uma data específica
   */
  static after(minDate: Date, fieldName: string): (value: unknown) => ValidationError | null {
    return (value: unknown) => {
      if (!(value instanceof Date) || isNaN(value.getTime())) {
        return new ValidationError(`${fieldName} must be a valid date`, fieldName, value)
      }
      if (value <= minDate) {
        return new ValidationError(`${fieldName} must be after ${minDate.toISOString()}`, fieldName, value)
      }
      return null
    }
  }
}

