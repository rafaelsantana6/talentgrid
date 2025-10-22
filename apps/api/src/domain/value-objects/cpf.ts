import { ValidationError } from '../types'
import { PrimitiveValueObject } from './value-object'

/**
 * Value Object para CPF (Cadastro de Pessoa Física)
 * Implementa validação completa do CPF brasileiro
 */
export class Cpf extends PrimitiveValueObject {
  private readonly _value: string

  constructor(value: string) {
    super()
    this._value = this.sanitize(value)
    this.validate()
  }

  /**
   * Retorna o valor do CPF formatado
   */
  get value(): string {
    return this._value
  }

  /**
   * Retorna o CPF apenas com números
   */
  get rawValue(): string {
    return this._value.replace(/\D/g, '')
  }

  /**
   * Retorna o CPF formatado (XXX.XXX.XXX-XX)
   */
  get formattedValue(): string {
    const numbers = this.rawValue
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }

  /**
   * Sanitiza o valor removendo caracteres não numéricos
   */
  private sanitize(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError('CPF must be a string', 'cpf', value)
    }
    return value.replace(/\D/g, '')
  }

  /**
   * Valida o CPF
   */
  protected validate(): void {
    const numbers = this._value

    // Verifica se tem 11 dígitos
    if (numbers.length !== 11) {
      throw new ValidationError('CPF must have exactly 11 digits', 'cpf', this._value)
    }

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(numbers)) {
      throw new ValidationError('CPF cannot have all digits equal', 'cpf', this._value)
    }

    // Validação dos dígitos verificadores
    if (!this.isValidChecksum(numbers)) {
      throw new ValidationError('Invalid CPF checksum', 'cpf', this._value)
    }
  }

  /**
   * Valida os dígitos verificadores do CPF
   */
  private isValidChecksum(cpf: string): boolean {
    // Primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]!, 10) * (10 - i)
    }
    let remainder = sum % 11
    const firstDigit = remainder < 2 ? 0 : 11 - remainder

    if (parseInt(cpf[9]!, 10) !== firstDigit) {
      return false
    }

    // Segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]!, 10) * (11 - i)
    }
    remainder = sum % 11
    const secondDigit = remainder < 2 ? 0 : 11 - remainder

    return parseInt(cpf[10]!, 10) === secondDigit
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
  clone(): Cpf {
    return new Cpf(this._value)
  }

  /**
   * Cria um CPF a partir de uma string
   */
  static create(value: string): Cpf {
    return new Cpf(value)
  }

  /**
   * Verifica se uma string é um CPF válido
   */
  static isValid(value: string): boolean {
    try {
      new Cpf(value)
      return true
    } catch {
      return false
    }
  }

  /**
   * Retorna uma representação string do CPF
   */
  toString(): string {
    return this.formattedValue
  }
}
