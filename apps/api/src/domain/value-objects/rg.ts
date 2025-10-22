import { ValidationError } from '../types'
import { PrimitiveValueObject } from './value-object'

/**
 * Value Object para RG (Registro Geral)
 * Implementa validação básica do RG brasileiro
 */
export class Rg extends PrimitiveValueObject {
  private readonly _value: string

  constructor(value: string) {
    super()
    this._value = this.sanitize(value)
    this.validate()
  }

  /**
   * Retorna o valor do RG
   */
  get value(): string {
    return this._value
  }

  /**
   * Retorna o RG apenas com números e letras
   */
  get rawValue(): string {
    return this._value.replace(/[^\dA-Za-z]/g, '')
  }

  /**
   * Retorna o RG formatado (XX.XXX.XXX-X)
   */
  get formattedValue(): string {
    const cleaned = this.rawValue
    if (cleaned.length >= 8) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}-${cleaned.slice(8)}`
    }
    return cleaned
  }

  /**
   * Sanitiza o valor removendo caracteres especiais desnecessários
   */
  private sanitize(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError('RG must be a string', 'rg', value)
    }
    return value.trim()
  }

  /**
   * Valida o RG
   */
  protected validate(): void {
    const cleaned = this.rawValue

    // Verifica se tem pelo menos 7 caracteres (formato mínimo)
    if (cleaned.length < 7) {
      throw new ValidationError('RG must have at least 7 characters', 'rg', this._value)
    }

    // Verifica se tem no máximo 12 caracteres (formato máximo)
    if (cleaned.length > 12) {
      throw new ValidationError('RG must have at most 12 characters', 'rg', this._value)
    }

    // Verifica se contém apenas números e letras
    if (!/^[\dA-Za-z]+$/.test(cleaned)) {
      throw new ValidationError('RG must contain only numbers and letters', 'rg', this._value)
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
  clone(): Rg {
    return new Rg(this._value)
  }

  /**
   * Cria um RG a partir de uma string
   */
  static create(value: string): Rg {
    return new Rg(value)
  }

  /**
   * Verifica se uma string é um RG válido
   */
  static isValid(value: string): boolean {
    try {
      new Rg(value)
      return true
    } catch {
      return false
    }
  }

  /**
   * Retorna uma representação string do RG
   */
  toString(): string {
    return this.formattedValue
  }
}
