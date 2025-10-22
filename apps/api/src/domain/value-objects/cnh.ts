import { PrimitiveValueObject } from './value-object'
import { ValidationError } from '../types'

/**
 * Value Object para CNH (Carteira Nacional de Habilitação)
 * Implementa validação básica do CNH brasileiro
 */
export class Cnh extends PrimitiveValueObject {
  private readonly _value: string

  constructor(value: string) {
    super()
    this._value = this.sanitize(value)
    this.validate()
  }

  /**
   * Retorna o valor do CNH
   */
  get value(): string {
    return this._value
  }

  /**
   * Retorna o CNH apenas com números
   */
  get rawValue(): string {
    return this._value.replace(/\D/g, '')
  }

  /**
   * Retorna o CNH formatado (XXXXXXXXXXX)
   */
  get formattedValue(): string {
    const numbers = this.rawValue
    if (numbers.length === 11) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
    }
    return numbers
  }

  /**
   * Sanitiza o valor removendo caracteres não numéricos
   */
  private sanitize(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError('CNH must be a string', 'cnh', value)
    }
    return value.replace(/\D/g, '')
  }

  /**
   * Valida o CNH
   */
  protected validate(): void {
    const numbers = this._value

    // Verifica se tem 11 dígitos
    if (numbers.length !== 11) {
      throw new ValidationError('CNH must have exactly 11 digits', 'cnh', this._value)
    }

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(numbers)) {
      throw new ValidationError('CNH cannot have all digits equal', 'cnh', this._value)
    }

    // Validação dos dígitos verificadores (algoritmo similar ao CPF)
    if (!this.isValidChecksum(numbers)) {
      throw new ValidationError('Invalid CNH checksum', 'cnh', this._value)
    }
  }

  /**
   * Valida os dígitos verificadores do CNH
   */
  private isValidChecksum(cnh: string): boolean {
    // Primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cnh[i]!) * (9 - i)
    }
    let remainder = sum % 11
    const firstDigit = remainder < 2 ? 0 : 11 - remainder

    if (parseInt(cnh[9]!) !== firstDigit) {
      return false
    }

    // Segundo dígito verificador
    sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cnh[i]!) * (9 - i)
    }
    sum += parseInt(cnh[9]!) * 2
    remainder = sum % 11
    const secondDigit = remainder < 2 ? 0 : 11 - remainder

    return parseInt(cnh[10]!) === secondDigit
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
  clone(): Cnh {
    return new Cnh(this._value)
  }

  /**
   * Cria um CNH a partir de uma string
   */
  static create(value: string): Cnh {
    return new Cnh(value)
  }

  /**
   * Verifica se uma string é um CNH válido
   */
  static isValid(value: string): boolean {
    try {
      new Cnh(value)
      return true
    } catch {
      return false
    }
  }

  /**
   * Retorna uma representação string do CNH
   */
  toString(): string {
    return this.formattedValue
  }
}
