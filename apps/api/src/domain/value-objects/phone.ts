import { ValidationError } from '../types'
import { PrimitiveValueObject } from './value-object'

/**
 * Value Object para Telefone
 * Implementa validação de números de telefone brasileiros
 */
export class Phone extends PrimitiveValueObject {
  private readonly _value: string

  constructor(value: string) {
    super()
    this._value = this.sanitize(value)
    this.validate()
  }

  /**
   * Retorna o valor do telefone
   */
  get value(): string {
    return this._value
  }

  /**
   * Retorna o telefone apenas com números
   */
  get rawValue(): string {
    return this._value.replace(/\D/g, '')
  }

  /**
   * Retorna o telefone formatado
   */
  get formattedValue(): string {
    const numbers = this.rawValue

    if (numbers.length === 10) {
      // Telefone fixo: (XX) XXXX-XXXX
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`
    } else if (numbers.length === 11) {
      // Celular: (XX) XXXXX-XXXX
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }

    return numbers
  }

  /**
   * Retorna o DDD
   */
  get areaCode(): string {
    return this.rawValue.slice(0, 2)
  }

  /**
   * Retorna o número sem DDD
   */
  get number(): string {
    return this.rawValue.slice(2)
  }

  /**
   * Verifica se é um celular
   */
  get isMobile(): boolean {
    return this.rawValue.length === 11
  }

  /**
   * Verifica se é um telefone fixo
   */
  get isLandline(): boolean {
    return this.rawValue.length === 10
  }

  /**
   * Sanitiza o valor removendo caracteres não numéricos
   */
  private sanitize(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError('Phone must be a string', 'phone', value)
    }
    return value.replace(/\D/g, '')
  }

  /**
   * Valida o telefone
   */
  protected validate(): void {
    const numbers = this._value

    // Verifica se tem 10 ou 11 dígitos
    if (numbers.length !== 10 && numbers.length !== 11) {
      throw new ValidationError('Phone must have 10 or 11 digits', 'phone', this._value)
    }

    // Verifica se o DDD é válido (11-99)
    const areaCode = parseInt(numbers.slice(0, 2), 10)
    if (areaCode < 11 || areaCode > 99) {
      throw new ValidationError('Invalid area code', 'phone', this._value)
    }

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{9,10}$/.test(numbers)) {
      throw new ValidationError('Phone cannot have all digits equal', 'phone', this._value)
    }

    // Validações específicas para celular
    if (numbers.length === 11) {
      // Primeiro dígito após o DDD deve ser 9 para celular
      if (numbers[2] !== '9') {
        throw new ValidationError('Mobile phone must start with 9 after area code', 'phone', this._value)
      }
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
  clone(): Phone {
    return new Phone(this._value)
  }

  /**
   * Cria um Phone a partir de uma string
   */
  static create(value: string): Phone {
    return new Phone(value)
  }

  /**
   * Verifica se uma string é um telefone válido
   */
  static isValid(value: string): boolean {
    try {
      new Phone(value)
      return true
    } catch {
      return false
    }
  }

  /**
   * Retorna uma representação string do telefone
   */
  toString(): string {
    return this.formattedValue
  }
}
