import { PrimitiveValueObject } from './value-object'
import { ValidationError } from '../types'

/**
 * Value Object para Email
 * Implementa validação completa de endereços de email
 */
export class Email extends PrimitiveValueObject {
  private readonly _value: string

  constructor(value: string) {
    super()
    this._value = this.sanitize(value)
    this.validate()
  }

  /**
   * Retorna o valor do email
   */
  get value(): string {
    return this._value
  }

  /**
   * Retorna o domínio do email
   */
  get domain(): string {
    return this._value.split('@')[1] || ''
  }

  /**
   * Retorna o nome de usuário do email
   */
  get username(): string {
    return this._value.split('@')[0] || ''
  }

  /**
   * Sanitiza o valor convertendo para minúsculas e removendo espaços
   */
  private sanitize(value: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError('Email must be a string', 'email', value)
    }
    return value.trim().toLowerCase()
  }

  /**
   * Valida o email
   */
  protected validate(): void {
    // Verifica se não está vazio
    if (!this._value) {
      throw new ValidationError('Email cannot be empty', 'email', this._value)
    }

    // Verifica se contém @
    if (!this._value.includes('@')) {
      throw new ValidationError('Email must contain @ symbol', 'email', this._value)
    }

    // Verifica se tem apenas um @
    const atCount = (this._value.match(/@/g) || []).length
    if (atCount !== 1) {
      throw new ValidationError('Email must contain exactly one @ symbol', 'email', this._value)
    }

    // Verifica o formato básico
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(this._value)) {
      throw new ValidationError('Invalid email format', 'email', this._value)
    }

    // Verifica comprimento máximo
    if (this._value.length > 254) {
      throw new ValidationError('Email cannot exceed 254 characters', 'email', this._value)
    }

    // Verifica comprimento do nome de usuário
    const username = this.username
    if (username.length > 64) {
      throw new ValidationError('Email username cannot exceed 64 characters', 'email', this._value)
    }

    // Verifica se não começa ou termina com ponto
    if (username.startsWith('.') || username.endsWith('.')) {
      throw new ValidationError('Email username cannot start or end with a dot', 'email', this._value)
    }

    // Verifica se não tem pontos consecutivos
    if (username.includes('..')) {
      throw new ValidationError('Email username cannot have consecutive dots', 'email', this._value)
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
  clone(): Email {
    return new Email(this._value)
  }

  /**
   * Cria um Email a partir de uma string
   */
  static create(value: string): Email {
    return new Email(value)
  }

  /**
   * Verifica se uma string é um email válido
   */
  static isValid(value: string): boolean {
    try {
      new Email(value)
      return true
    } catch {
      return false
    }
  }

  /**
   * Retorna uma representação string do email
   */
  toString(): string {
    return this._value
  }
}
