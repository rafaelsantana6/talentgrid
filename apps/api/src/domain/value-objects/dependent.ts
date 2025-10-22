import { PrimitiveValueObject } from './value-object'
import { ValidationError } from '../types'
import type { DependentType, DependentStatus, Gender } from './enums'

/**
 * Value Object para Dependente
 * Representa um dependente do funcionário
 */
export class Dependent extends PrimitiveValueObject {
  private readonly _name: string
  private readonly _birthDate: Date
  private readonly _gender: Gender
  private readonly _type: DependentType
  private readonly _cpf?: string
  private readonly _rg?: string
  private readonly _status: DependentStatus
  private readonly _isEmergencyContact: boolean
  private readonly _phone?: string
  private readonly _email?: string

  constructor(
    name: string,
    birthDate: Date,
    gender: Gender,
    type: DependentType,
    status: DependentStatus = DependentStatus.ACTIVE,
    isEmergencyContact: boolean = false,
    cpf?: string,
    rg?: string,
    phone?: string,
    email?: string
  ) {
    super()
    this._name = this.sanitizeString(name, 'name')
    this._birthDate = birthDate
    this._gender = gender
    this._type = type
    this._cpf = cpf
    this._rg = rg
    this._status = status
    this._isEmergencyContact = isEmergencyContact
    this._phone = phone
    this._email = email
    this.validate()
  }

  get name(): string {
    return this._name
  }

  get birthDate(): Date {
    return new Date(this._birthDate)
  }

  get gender(): Gender {
    return this._gender
  }

  get type(): DependentType {
    return this._type
  }

  get cpf(): string | undefined {
    return this._cpf
  }

  get rg(): string | undefined {
    return this._rg
  }

  get status(): DependentStatus {
    return this._status
  }

  get isEmergencyContact(): boolean {
    return this._isEmergencyContact
  }

  get phone(): string | undefined {
    return this._phone
  }

  get email(): string | undefined {
    return this._email
  }

  /**
   * Calcula a idade do dependente
   */
  get age(): number {
    const today = new Date()
    const birthDate = this._birthDate
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  /**
   * Verifica se o dependente é menor de idade
   */
  get isMinor(): boolean {
    return this.age < 18
  }

  /**
   * Sanitiza uma string removendo espaços extras
   */
  private sanitizeString(value: string, fieldName: string): string {
    if (typeof value !== 'string') {
      throw new ValidationError(`${fieldName} must be a string`, fieldName, value)
    }
    return value.trim()
  }

  /**
   * Valida o dependente
   */
  protected validate(): void {
    // Validação do nome
    if (this._name.length < 2) {
      throw new ValidationError('Dependent name must have at least 2 characters', 'name', this._name)
    }

    if (this._name.length > 100) {
      throw new ValidationError('Dependent name cannot exceed 100 characters', 'name', this._name)
    }

    // Validação da data de nascimento
    if (!(this._birthDate instanceof Date) || Number.isNaN(this._birthDate.getTime())) {
      throw new ValidationError('Birth date must be a valid date', 'birthDate', this._birthDate)
    }

    const today = new Date()
    if (this._birthDate > today) {
      throw new ValidationError('Birth date cannot be in the future', 'birthDate', this._birthDate)
    }

    // Verifica se não é muito antigo (mais de 120 anos)
    const maxAge = 120
    const minBirthDate = new Date()
    minBirthDate.setFullYear(today.getFullYear() - maxAge)
    
    if (this._birthDate < minBirthDate) {
      throw new ValidationError(`Birth date cannot be more than ${maxAge} years ago`, 'birthDate', this._birthDate)
    }

    // Validação do CPF se fornecido
    if (this._cpf) {
      const cpfRegex = /^\d{11}$/
      if (!cpfRegex.test(this._cpf.replace(/\D/g, ''))) {
        throw new ValidationError('Invalid CPF format', 'cpf', this._cpf)
      }
    }

    // Validação do RG se fornecido
    if (this._rg) {
      const rgRegex = /^[\dA-Za-z]{7,12}$/
      if (!rgRegex.test(this._rg.replace(/[^\dA-Za-z]/g, ''))) {
        throw new ValidationError('Invalid RG format', 'rg', this._rg)
      }
    }

    // Validação do telefone se fornecido
    if (this._phone) {
      const phoneRegex = /^\d{10,11}$/
      if (!phoneRegex.test(this._phone.replace(/\D/g, ''))) {
        throw new ValidationError('Invalid phone format', 'phone', this._phone)
      }
    }

    // Validação do email se fornecido
    if (this._email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this._email)) {
        throw new ValidationError('Invalid email format', 'email', this._email)
      }
    }

    // Validações específicas por tipo de dependente
    if (this._type === DependentType.SPOUSE && this.age < 16) {
      throw new ValidationError('Spouse must be at least 16 years old', 'birthDate', this._birthDate)
    }

    if (this._type === DependentType.CHILD && this.age > 24) {
      throw new ValidationError('Child dependent cannot be older than 24 years', 'birthDate', this._birthDate)
    }
  }

  /**
   * Retorna os valores primitivos para comparação
   */
  protected getPrimitiveValues(): unknown[] {
    return [
      this._name,
      this._birthDate,
      this._gender,
      this._type,
      this._cpf,
      this._rg,
      this._status,
      this._isEmergencyContact,
      this._phone,
      this._email
    ]
  }

  /**
   * Cria uma cópia do Value Object
   */
  clone(): Dependent {
    return new Dependent(
      this._name,
      this._birthDate,
      this._gender,
      this._type,
      this._status,
      this._isEmergencyContact,
      this._cpf,
      this._rg,
      this._phone,
      this._email
    )
  }

  /**
   * Cria um Dependent a partir de dados
   */
  static create(data: {
    name: string
    birthDate: Date
    gender: Gender
    type: DependentType
    status?: DependentStatus
    isEmergencyContact?: boolean
    cpf?: string
    rg?: string
    phone?: string
    email?: string
  }): Dependent {
    return new Dependent(
      data.name,
      data.birthDate,
      data.gender,
      data.type,
      data.status,
      data.isEmergencyContact,
      data.cpf,
      data.rg,
      data.phone,
      data.email
    )
  }

  /**
   * Retorna uma representação string do dependente
   */
  toString(): string {
    return `${this._name} (${this._type}, ${this.age} anos)`
  }
}
