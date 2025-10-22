import { PrimitiveValueObject } from './value-object'
import { ValidationError } from '../types'
import { AddressType } from './enums'

/**
 * Value Object para Endereço
 * Representa um endereço completo
 */
export class Address extends PrimitiveValueObject {
  private readonly _street: string
  private readonly _number: string
  private readonly _complement?: string
  private readonly _neighborhood: string
  private readonly _city: string
  private readonly _state: string
  private readonly _zipCode: string
  private readonly _country: string
  private readonly _type: AddressType

  constructor(
    street: string,
    number: string,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
    country: string = 'Brasil',
    type: AddressType = AddressType.RESIDENTIAL,
    complement?: string
  ) {
    super()
    this._street = this.sanitizeString(street, 'street')
    this._number = this.sanitizeString(number, 'number')
    this._complement = complement ? this.sanitizeString(complement, 'complement') : undefined
    this._neighborhood = this.sanitizeString(neighborhood, 'neighborhood')
    this._city = this.sanitizeString(city, 'city')
    this._state = this.sanitizeString(state, 'state')
    this._zipCode = zipCode
    this._country = this.sanitizeString(country, 'country')
    this._type = type
    this.validate()
  }

  get street(): string {
    return this._street
  }

  get number(): string {
    return this._number
  }

  get complement(): string | undefined {
    return this._complement
  }

  get neighborhood(): string {
    return this._neighborhood
  }

  get city(): string {
    return this._city
  }

  get state(): string {
    return this._state
  }

  get zipCode(): string {
    return this._zipCode
  }

  get country(): string {
    return this._country
  }

  get type(): AddressType {
    return this._type
  }

  /**
   * Retorna o endereço formatado
   */
  get formattedAddress(): string {
    let address = `${this._street}, ${this._number}`
    
    if (this._complement) {
      address += `, ${this._complement}`
    }
    
    address += `, ${this._neighborhood}, ${this._city}/${this._state}, ${this._zipCode}`
    
    if (this._country !== 'Brasil') {
      address += `, ${this._country}`
    }
    
    return address
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
   * Valida o endereço
   */
  protected validate(): void {
    // Validações básicas de comprimento
    if (this._street.length < 3) {
      throw new ValidationError('Street must have at least 3 characters', 'street', this._street)
    }

    if (this._street.length > 200) {
      throw new ValidationError('Street cannot exceed 200 characters', 'street', this._street)
    }

    if (this._number.length < 1) {
      throw new ValidationError('Number cannot be empty', 'number', this._number)
    }

    if (this._number.length > 20) {
      throw new ValidationError('Number cannot exceed 20 characters', 'number', this._number)
    }

    if (this._neighborhood.length < 2) {
      throw new ValidationError('Neighborhood must have at least 2 characters', 'neighborhood', this._neighborhood)
    }

    if (this._neighborhood.length > 100) {
      throw new ValidationError('Neighborhood cannot exceed 100 characters', 'neighborhood', this._neighborhood)
    }

    if (this._city.length < 2) {
      throw new ValidationError('City must have at least 2 characters', 'city', this._city)
    }

    if (this._city.length > 100) {
      throw new ValidationError('City cannot exceed 100 characters', 'city', this._city)
    }

    if (this._state.length !== 2) {
      throw new ValidationError('State must have exactly 2 characters (UF)', 'state', this._state)
    }

    if (this._country.length < 2) {
      throw new ValidationError('Country must have at least 2 characters', 'country', this._country)
    }

    if (this._country.length > 100) {
      throw new ValidationError('Country cannot exceed 100 characters', 'country', this._country)
    }

    // Validação do estado brasileiro
    const validStates = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]

    if (this._country === 'Brasil' && !validStates.includes(this._state.toUpperCase())) {
      throw new ValidationError('Invalid Brazilian state', 'state', this._state)
    }

    // Validação do complemento se fornecido
    if (this._complement && this._complement.length > 100) {
      throw new ValidationError('Complement cannot exceed 100 characters', 'complement', this._complement)
    }
  }

  /**
   * Retorna os valores primitivos para comparação
   */
  protected getPrimitiveValues(): unknown[] {
    return [
      this._street,
      this._number,
      this._complement,
      this._neighborhood,
      this._city,
      this._state,
      this._zipCode,
      this._country,
      this._type
    ]
  }

  /**
   * Cria uma cópia do Value Object
   */
  clone(): Address {
    return new Address(
      this._street,
      this._number,
      this._neighborhood,
      this._city,
      this._state,
      this._zipCode,
      this._country,
      this._type,
      this._complement
    )
  }

  /**
   * Cria um Address a partir de dados
   */
  static create(data: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    country?: string
    type?: AddressType
    complement?: string
  }): Address {
    return new Address(
      data.street,
      data.number,
      data.neighborhood,
      data.city,
      data.state,
      data.zipCode,
      data.country,
      data.type,
      data.complement
    )
  }

  /**
   * Retorna uma representação string do endereço
   */
  toString(): string {
    return this.formattedAddress
  }
}
