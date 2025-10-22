import { ValidationError } from '../types'
import { PrimitiveValueObject } from './value-object'

/**
 * Value Object para CEP (Código de Endereçamento Postal)
 * Implementa validação do CEP brasileiro
 */
export class Cep extends PrimitiveValueObject {
  private readonly _value: string

  constructor(value: string) {
    super()
    this._value = this.sanitize(value)
    this.validate()
  }

  /**
   * Retorna o valor do CEP
   */
  get value(): string {
    return this._value
  }

  /**
   * Retorna o CEP apenas com números
   */
  get rawValue(): string {
    return this._value.replace(/\D/g, '')
  }

  /**
   * Retorna o CEP formatado (XXXXX-XXX)
   */
  get formattedValue(): string {
    const numbers = this.rawValue
    if (numbers.length === 8) {
      return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
    }
    return numbers
  }

  /**
   * Retorna os primeiros 5 dígitos (parte principal)
   */
  get mainPart(): string {
    return this.rawValue.slice(0, 5)
  }

  /**
   * Retorna os últimos 3 dígitos (sufixo)
   */
  get suffix(): string {
    return this.rawValue.slice(5, 8)
  }

  /**
   * Sanitiza o valor removendo caracteres não numéricos
   */
  private sanitize(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError('CEP must be a string', 'cep', value)
    }
    return value.replace(/\D/g, '')
  }

  /**
   * Valida o CEP
   */
  protected validate(): void {
    const numbers = this._value

    // Verifica se tem exatamente 8 dígitos
    if (numbers.length !== 8) {
      throw new ValidationError('CEP must have exactly 8 digits', 'cep', this._value)
    }

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{7}$/.test(numbers)) {
      throw new ValidationError('CEP cannot have all digits equal', 'cep', this._value)
    }

    // Verifica se não é uma sequência inválida comum
    const invalidSequences = [
      '00000000',
      '11111111',
      '22222222',
      '33333333',
      '44444444',
      '55555555',
      '66666666',
      '77777777',
      '88888888',
      '99999999',
    ]

    if (invalidSequences.includes(numbers)) {
      throw new ValidationError('Invalid CEP sequence', 'cep', this._value)
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
  clone(): Cep {
    return new Cep(this._value)
  }

  /**
   * Cria um CEP a partir de uma string
   */
  static create(value: string): Cep {
    return new Cep(value)
  }

  /**
   * Verifica se uma string é um CEP válido
   */
  static isValid(value: string): boolean {
    try {
      new Cep(value)
      return true
    } catch {
      return false
    }
  }

  /**
   * Retorna uma representação string do CEP
   */
  toString(): string {
    return this.formattedValue
  }
}
