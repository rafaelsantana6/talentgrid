import type { ISpecification } from '../interfaces'

/**
 * Classe base abstrata para Specifications
 * @template T - Tipo do objeto a ser especificado
 */
export abstract class Specification<T> implements ISpecification<T> {
  /**
   * Verifica se o candidato satisfaz a especificação
   */
  abstract isSatisfiedBy(candidate: T): boolean

  /**
   * Combina esta especificação com outra usando AND
   */
  and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, other)
  }

  /**
   * Combina esta especificação com outra usando OR
   */
  or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, other)
  }

  /**
   * Nega esta especificação
   */
  not(): ISpecification<T> {
    return new NotSpecification(this)
  }

  /**
   * Retorna uma representação string da especificação
   */
  abstract toString(): string
}

/**
 * Especificação que combina duas especificações com AND
 */
export class AndSpecification<T> extends Specification<T> {
  constructor(
    private readonly left: ISpecification<T>,
    private readonly right: ISpecification<T>
  ) {
    super()
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate)
  }

  toString(): string {
    return `(${this.left.toString()} AND ${this.right.toString()})`
  }
}

/**
 * Especificação que combina duas especificações com OR
 */
export class OrSpecification<T> extends Specification<T> {
  constructor(
    private readonly left: ISpecification<T>,
    private readonly right: ISpecification<T>
  ) {
    super()
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate)
  }

  toString(): string {
    return `(${this.left.toString()} OR ${this.right.toString()})`
  }
}

/**
 * Especificação que nega outra especificação
 */
export class NotSpecification<T> extends Specification<T> {
  constructor(private readonly specification: ISpecification<T>) {
    super()
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.specification.isSatisfiedBy(candidate)
  }

  toString(): string {
    return `NOT(${this.specification.toString()})`
  }
}

/**
 * Especificação que sempre retorna true
 */
export class TrueSpecification<T> extends Specification<T> {
  isSatisfiedBy(candidate: T): boolean {
    return true
  }

  toString(): string {
    return 'TRUE'
  }
}

/**
 * Especificação que sempre retorna false
 */
export class FalseSpecification<T> extends Specification<T> {
  isSatisfiedBy(candidate: T): boolean {
    return false
  }

  toString(): string {
    return 'FALSE'
  }
}

/**
 * Especificação baseada em uma função
 */
export class FunctionSpecification<T> extends Specification<T> {
  constructor(
    private readonly predicate: (candidate: T) => boolean,
    private readonly description: string = 'FunctionSpecification'
  ) {
    super()
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.predicate(candidate)
  }

  toString(): string {
    return this.description
  }
}

/**
 * Especificação para comparação de propriedades
 */
export class PropertySpecification<T> extends Specification<T> {
  constructor(
    private readonly propertyName: keyof T,
    private readonly operator:
      | 'equals'
      | 'notEquals'
      | 'greaterThan'
      | 'lessThan'
      | 'greaterThanOrEqual'
      | 'lessThanOrEqual'
      | 'contains'
      | 'startsWith'
      | 'endsWith',
    private readonly value: unknown
  ) {
    super()
  }

  isSatisfiedBy(candidate: T): boolean {
    const propertyValue = candidate[this.propertyName]

    switch (this.operator) {
      case 'equals':
        return propertyValue === this.value
      case 'notEquals':
        return propertyValue !== this.value
      case 'greaterThan':
        return (propertyValue as number) > (this.value as number)
      case 'lessThan':
        return (propertyValue as number) < (this.value as number)
      case 'greaterThanOrEqual':
        return (propertyValue as number) >= (this.value as number)
      case 'lessThanOrEqual':
        return (propertyValue as number) <= (this.value as number)
      case 'contains':
        return String(propertyValue).includes(String(this.value))
      case 'startsWith':
        return String(propertyValue).startsWith(String(this.value))
      case 'endsWith':
        return String(propertyValue).endsWith(String(this.value))
      default:
        return false
    }
  }

  toString(): string {
    return `${String(this.propertyName)} ${this.operator} ${this.value}`
  }
}

/**
 * Especificação para valores nulos
 */
export class NullSpecification<T> extends Specification<T> {
  constructor(private readonly propertyName: keyof T) {
    super()
  }

  isSatisfiedBy(candidate: T): boolean {
    return candidate[this.propertyName] === null || candidate[this.propertyName] === undefined
  }

  toString(): string {
    return `${String(this.propertyName)} IS NULL`
  }
}

/**
 * Especificação para valores não nulos
 */
export class NotNullSpecification<T> extends Specification<T> {
  constructor(private readonly propertyName: keyof T) {
    super()
  }

  isSatisfiedBy(candidate: T): boolean {
    return candidate[this.propertyName] !== null && candidate[this.propertyName] !== undefined
  }

  toString(): string {
    return `${String(this.propertyName)} IS NOT NULL`
  }
}

/**
 * Especificação para valores em uma lista
 */
export class InSpecification<T> extends Specification<T> {
  constructor(
    private readonly propertyName: keyof T,
    private readonly values: unknown[]
  ) {
    super()
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.values.includes(candidate[this.propertyName])
  }

  toString(): string {
    return `${String(this.propertyName)} IN (${this.values.join(', ')})`
  }
}

/**
 * Especificação para valores não em uma lista
 */
export class NotInSpecification<T> extends Specification<T> {
  constructor(
    private readonly propertyName: keyof T,
    private readonly values: unknown[]
  ) {
    super()
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.values.includes(candidate[this.propertyName])
  }

  toString(): string {
    return `${String(this.propertyName)} NOT IN (${this.values.join(', ')})`
  }
}

/**
 * Especificação para comparação de datas
 */
export class DateRangeSpecification<T> extends Specification<T> {
  constructor(
    private readonly propertyName: keyof T,
    private readonly startDate?: Date,
    private readonly endDate?: Date
  ) {
    super()
  }

  isSatisfiedBy(candidate: T): boolean {
    const dateValue = candidate[this.propertyName] as Date

    if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
      return false
    }

    if (this.startDate && dateValue < this.startDate) {
      return false
    }

    if (this.endDate && dateValue > this.endDate) {
      return false
    }

    return true
  }

  toString(): string {
    const start = this.startDate?.toISOString() || 'null'
    const end = this.endDate?.toISOString() || 'null'
    return `${String(this.propertyName)} BETWEEN ${start} AND ${end}`
  }
}

/**
 * Builder para criar especificações complexas
 */
export class SpecificationBuilder<T> {
  private specifications: ISpecification<T>[] = []

  /**
   * Adiciona uma especificação
   */
  add(specification: ISpecification<T>): SpecificationBuilder<T> {
    this.specifications.push(specification)
    return this
  }

  /**
   * Adiciona uma especificação de propriedade
   */
  property<K extends keyof T>(
    propertyName: K,
    operator:
      | 'equals'
      | 'notEquals'
      | 'greaterThan'
      | 'lessThan'
      | 'greaterThanOrEqual'
      | 'lessThanOrEqual'
      | 'contains'
      | 'startsWith'
      | 'endsWith',
    value: T[K]
  ): SpecificationBuilder<T> {
    this.specifications.push(new PropertySpecification(propertyName, operator, value))
    return this
  }

  /**
   * Adiciona uma especificação de valor nulo
   */
  isNull<K extends keyof T>(propertyName: K): SpecificationBuilder<T> {
    this.specifications.push(new NullSpecification(propertyName))
    return this
  }

  /**
   * Adiciona uma especificação de valor não nulo
   */
  isNotNull<K extends keyof T>(propertyName: K): SpecificationBuilder<T> {
    this.specifications.push(new NotNullSpecification(propertyName))
    return this
  }

  /**
   * Adiciona uma especificação de valores em lista
   */
  in<K extends keyof T>(propertyName: K, values: T[K][]): SpecificationBuilder<T> {
    this.specifications.push(new InSpecification(propertyName, values))
    return this
  }

  /**
   * Adiciona uma especificação de valores não em lista
   */
  notIn<K extends keyof T>(propertyName: K, values: T[K][]): SpecificationBuilder<T> {
    this.specifications.push(new NotInSpecification(propertyName, values))
    return this
  }

  /**
   * Adiciona uma especificação de range de datas
   */
  dateRange<K extends keyof T>(propertyName: K, startDate?: Date, endDate?: Date): SpecificationBuilder<T> {
    this.specifications.push(new DateRangeSpecification(propertyName, startDate, endDate))
    return this
  }

  /**
   * Adiciona uma especificação customizada
   */
  custom(predicate: (candidate: T) => boolean, description?: string): SpecificationBuilder<T> {
    this.specifications.push(new FunctionSpecification(predicate, description))
    return this
  }

  /**
   * Constrói a especificação final combinando todas com AND
   */
  build(): ISpecification<T> {
    if (this.specifications.length === 0) {
      return new TrueSpecification<T>()
    }

    if (this.specifications.length === 1) {
      return this.specifications[0]!
    }

    return this.specifications.reduce((acc, spec) => acc.and(spec))
  }

  /**
   * Constrói a especificação final combinando todas com OR
   */
  buildOr(): ISpecification<T> {
    if (this.specifications.length === 0) {
      return new TrueSpecification<T>()
    }

    if (this.specifications.length === 1) {
      return this.specifications[0]!
    }

    return this.specifications.reduce((acc, spec) => acc.or(spec))
  }
}

