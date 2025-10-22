/**
 * Interface base para identificadores únicos no domínio
 * @template T - Tipo do valor do identificador
 */
export interface IId<T = string> {
  readonly value: T
  equals(other: IId<T>): boolean
  toString(): string
  hashCode(): number
}

/**
 * Interface base para Value Objects
 * Value Objects são objetos imutáveis que representam conceitos do domínio
 */
export interface IValueObject {
  equals(other: IValueObject): boolean
  hashCode(): number
}

/**
 * Interface base para Entidades
 * Entidades são objetos com identidade única que podem mudar ao longo do tempo
 * @template TId - Tipo do identificador da entidade
 */
export interface IEntity<TId = string> {
  readonly id: IId<TId>
  equals(other: IEntity<TId>): boolean
}

/**
 * Interface base para Agregados
 * Agregados são clusters de objetos de domínio tratados como uma unidade
 * @template TId - Tipo do identificador do agregado
 */
export interface IAggregateRoot<TId = string> extends IEntity<TId> {
  readonly version: number
  readonly createdAt: Date
  readonly updatedAt: Date
  getUncommittedEvents(): IDomainEvent[]
  markEventsAsCommitted(): void
  incrementVersion(): void
}

/**
 * Interface base para Eventos de Domínio
 * Eventos representam algo importante que aconteceu no domínio
 */
export interface IDomainEvent {
  readonly eventId: string
  readonly occurredOn: Date
  readonly eventType: string
  readonly aggregateId: string
  readonly version: number
}

/**
 * Interface base para Handlers de Eventos de Domínio
 */
export interface IDomainEventHandler<T extends IDomainEvent = IDomainEvent> {
  handle(event: T): Promise<void>
}

/**
 * Interface base para Repositórios
 * @template TEntity - Tipo da entidade
 * @template TId - Tipo do identificador
 */
export interface IRepository<TEntity extends IEntity<TId>, TId = string> {
  findById(id: IId<TId>): Promise<TEntity | null>
  save(entity: TEntity): Promise<void>
  delete(id: IId<TId>): Promise<void>
  exists(id: IId<TId>): Promise<boolean>
}

/**
 * Interface para Unit of Work
 * Gerencia transações e coordena repositórios
 */
export interface IUnitOfWork {
  begin(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
  isActive(): boolean
}

/**
 * Interface para Specifications
 * Padrão para encapsular regras de negócio reutilizáveis
 * @template T - Tipo do objeto a ser especificado
 */
export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean
  and(other: ISpecification<T>): ISpecification<T>
  or(other: ISpecification<T>): ISpecification<T>
  not(): ISpecification<T>
}

/**
 * Interface para Serviços de Domínio
 * Serviços que contêm lógica de domínio que não pertence a uma entidade específica
 */
export type IDomainService = {}

/**
 * Interface para Validação
 * Representa o resultado de uma operação que pode falhar
 * @template T - Tipo do valor de sucesso
 * @template E - Tipo do erro
 */
export interface IResult<T, E = Error> {
  readonly isSuccess: boolean
  readonly isFailure: boolean
  readonly value: T | null
  readonly error: E | null

  map<U>(fn: (value: T) => U): IResult<U, E>
  mapError<F>(fn: (error: E) => F): IResult<T, F>
  flatMap<U, F>(fn: (value: T) => IResult<U, F>): IResult<U, E | F>
  onSuccess(fn: (value: T) => void): IResult<T, E>
  onFailure(fn: (error: E) => void): IResult<T, E>
}

/**
 * Interface para Erros de Domínio
 * Erros específicos do domínio de negócio
 */
export interface IDomainError {
  readonly code: string
  readonly message: string
  readonly details?: Record<string, unknown>
}

/**
 * Interface para Validação de Entrada
 * Validação de dados de entrada antes de criar objetos de domínio
 */
export interface IValidator<T> {
  validate(data: unknown): IResult<T, ValidationError[]>
}

/**
 * Tipo para erros de validação
 */
export interface ValidationError {
  readonly field: string
  readonly message: string
  readonly code: string
}

/**
 * Interface para Factory Pattern
 * Criação de objetos complexos de domínio
 * @template T - Tipo do objeto a ser criado
 * @template TInput - Tipo dos dados de entrada
 */
export interface IFactory<T, TInput = unknown> {
  create(input: TInput): IResult<T, ValidationError[]>
}

/**
 * Interface para Builder Pattern
 * Construção passo a passo de objetos complexos
 * @template T - Tipo do objeto a ser construído
 */
export interface IBuilder<T> {
  build(): IResult<T, ValidationError[]>
}

