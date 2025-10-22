import { PrimitiveValueObject } from './value-object'
import { ValidationError } from '../types'

/**
 * Value Object para Salário
 * Implementa validação de valores monetários
 */
export class Salary extends PrimitiveValueObject {
  private readonly _value: number

  constructor(value: number) {
    super()
    this._value = value
    this.validate()
  }

  /**
   * Retorna o valor do salário
   */
  get value(): number {
    return this._value
  }

  /**
   * Retorna o salário formatado como moeda brasileira
   */
  get formattedValue(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this._value)
  }

  /**
   * Retorna o salário em centavos
   */
  get cents(): number {
    return Math.round(this._value * 100)
  }

  /**
   * Valida o salário
   */
  protected validate(): void {
    // Verifica se é um número válido
    if (typeof this._value !== 'number' || Number.isNaN(this._value)) {
      throw new ValidationError('Salary must be a valid number', 'salary', this._value)
    }

    // Verifica se é positivo
    if (this._value < 0) {
      throw new ValidationError('Salary cannot be negative', 'salary', this._value)
    }

    // Verifica se não excede um valor máximo razoável (R$ 1.000.000)
    if (this._value > 1000000) {
      throw new ValidationError('Salary cannot exceed R$ 1,000,000', 'salary', this._value)
    }

    // Verifica se tem no máximo 2 casas decimais
    const decimalPlaces = (this._value.toString().split('.')[1] || '').length
    if (decimalPlaces > 2) {
      throw new ValidationError('Salary cannot have more than 2 decimal places', 'salary', this._value)
    }
  }

  /**
   * Retorna os valores primitivos para comparação
   */
  protected getPrimitiveValues(): unknown[] {
    return [this._value]
  }

  /**
   * Cria uma cópia do Value Object
   */
  clone(): Salary {
    return new Salary(this._value)
  }

  /**
   * Cria um Salary a partir de um número
   */
  static create(value: number): Salary {
    return new Salary(value)
  }

  /**
   * Cria um Salary a partir de centavos
   */
  static fromCents(cents: number): Salary {
    return new Salary(cents / 100)
  }

  /**
   * Verifica se um número é um salário válido
   */
  static isValid(value: number): boolean {
    try {
      new Salary(value)
      return true
    } catch {
      return false
    }
  }

  /**
   * Retorna uma representação string do salário
   */
  toString(): string {
    return this.formattedValue
  }
}
