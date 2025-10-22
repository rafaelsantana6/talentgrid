// Interfaces do domínio
export * from './interfaces'

// Tipos base (exceto ValidationError que já está em interfaces)
export { Result, Either, Maybe, DomainError, EntityNotFoundError, BusinessRuleViolationError, OperationNotAllowedError, ConcurrencyError } from './types'

// Entidades
export * from './entities/entity'
export * from './entities/aggregate-root'

// Eventos de domínio
export * from './events'

// Repositórios
export * from './repositories/interfaces'

// Specifications
export * from './specifications'

// Validação
export * from './validation'

// Value Objects
export * from './value-objects/id'
export * from './value-objects/value-object'


