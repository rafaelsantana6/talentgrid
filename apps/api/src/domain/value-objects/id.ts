import { Result, ValidationError } from '../types';

/**
 * Classe base para identificadores únicos no domínio
 * @template T - Tipo do valor do identificador
 */
export abstract class Id<T = string> {
  protected constructor(protected readonly _value: T) {
    this.validate();
  }

  /**
   * Valida o identificador
   * Deve ser implementado pelas classes filhas
   */
  protected abstract validate(): void;

  /**
   * Retorna o valor do identificador
   */
  get value(): T {
    return this._value;
  }

  /**
   * Verifica se dois identificadores são iguais
   */
  equals(other: Id<T>): boolean {
    if (!other) return false;
    if (this.constructor !== other.constructor) return false;
    return this._value === other._value;
  }

  /**
   * Retorna uma representação string do identificador
   */
  toString(): string {
    return String(this._value);
  }

  /**
   * Retorna o hash code do identificador
   */
  hashCode(): number {
    return this.toString().split('').reduce((hash, char) => {
      const charCode = char.charCodeAt(0);
      hash = ((hash << 5) - hash) + charCode;
      return hash & hash; // Convert to 32-bit integer
    }, 0);
  }
}

/**
 * Implementação de ID para strings
 */
export class StringId extends Id<string> {
  constructor(value: string) {
    super(value);
  }

  protected validate(): void {
    if (!this._value || typeof this._value !== 'string') {
      throw new ValidationError('ID must be a non-empty string', 'id', this._value);
    }
    
    if (this._value.trim().length === 0) {
      throw new ValidationError('ID cannot be empty or whitespace', 'id', this._value);
    }
  }

  /**
   * Cria um novo StringId a partir de uma string
   */
  static create(value: string): Result<StringId, ValidationError> {
    try {
      return Result.success(new StringId(value));
    } catch (error) {
      return Result.failure(error as ValidationError);
    }
  }

  /**
   * Gera um novo StringId aleatório
   */
  static generate(): StringId {
    const randomId = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
    return new StringId(randomId);
  }
}

/**
 * Implementação de ID para números
 */
export class NumberId extends Id<number> {
  constructor(value: number) {
    super(value);
  }

  protected validate(): void {
    if (typeof this._value !== 'number' || isNaN(this._value)) {
      throw new ValidationError('ID must be a valid number', 'id', this._value);
    }
    
    if (!Number.isInteger(this._value)) {
      throw new ValidationError('ID must be an integer', 'id', this._value);
    }
    
    if (this._value <= 0) {
      throw new ValidationError('ID must be a positive integer', 'id', this._value);
    }
  }

  /**
   * Cria um novo NumberId a partir de um número
   */
  static create(value: number): Result<NumberId, ValidationError> {
    try {
      return Result.success(new NumberId(value));
    } catch (error) {
      return Result.failure(error as ValidationError);
    }
  }
}

/**
 * Implementação de ID para UUID
 */
export class UuidId extends Id<string> {
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  constructor(value: string) {
    super(value);
  }

  protected validate(): void {
    if (!this._value || typeof this._value !== 'string') {
      throw new ValidationError('UUID must be a non-empty string', 'id', this._value);
    }
    
    if (!UuidId.UUID_REGEX.test(this._value)) {
      throw new ValidationError('Invalid UUID format', 'id', this._value);
    }
  }

  /**
   * Cria um novo UuidId a partir de uma string UUID
   */
  static create(value: string): Result<UuidId, ValidationError> {
    try {
      return Result.success(new UuidId(value));
    } catch (error) {
      return Result.failure(error as ValidationError);
    }
  }

  /**
   * Gera um novo UUID v4
   */
  static generate(): UuidId {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    return new UuidId(uuid);
  }
}

/**
 * Factory para criar IDs baseado no tipo
 */
export class IdFactory {
  /**
   * Cria um ID baseado no tipo especificado
   */
  static create<T extends string | number>(
    type: 'string' | 'number' | 'uuid',
    value: T,
  ): Result<StringId | NumberId | UuidId, ValidationError> {
    switch (type) {
      case 'string':
        return StringId.create(value as string);
      case 'number':
        return NumberId.create(value as number);
      case 'uuid':
        return UuidId.create(value as string);
      default:
        return Result.failure(new ValidationError(`Unsupported ID type: ${type}`, 'type', type));
    }
  }

  /**
   * Gera um novo ID baseado no tipo especificado
   */
  static generate(type: 'string' | 'uuid'): StringId | UuidId {
    switch (type) {
      case 'string':
        return StringId.generate();
      case 'uuid':
        return UuidId.generate();
      default:
        throw new ValidationError(`Cannot generate ID for type: ${type}`, 'type', type);
    }
  }
}

