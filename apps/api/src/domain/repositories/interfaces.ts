import type { IEntity, IId, IRepository, ISpecification, IUnitOfWork } from '../interfaces'
import type { Maybe, Result } from '../types'

/**
 * Interface estendida para repositórios com funcionalidades avançadas
 * @template TEntity - Tipo da entidade
 * @template TId - Tipo do identificador
 */
export interface IAdvancedRepository<TEntity extends IEntity<TId>, TId = string> extends IRepository<TEntity, TId> {
  /**
   * Busca todas as entidades
   */
  findAll(): Promise<TEntity[]>

  /**
   * Busca entidades com paginação
   */
  findWithPagination(page: number, limit: number, orderBy?: string, orderDirection?: 'ASC' | 'DESC'): Promise<PaginatedResult<TEntity>>

  /**
   * Busca entidades que satisfazem uma especificação
   */
  findBySpecification(specification: ISpecification<TEntity>): Promise<TEntity[]>

  /**
   * Busca a primeira entidade que satisfaz uma especificação
   */
  findFirstBySpecification(specification: ISpecification<TEntity>): Promise<Maybe<TEntity>>

  /**
   * Conta o número de entidades que satisfazem uma especificação
   */
  countBySpecification(specification: ISpecification<TEntity>): Promise<number>

  /**
   * Verifica se existe pelo menos uma entidade que satisfaz uma especificação
   */
  existsBySpecification(specification: ISpecification<TEntity>): Promise<boolean>

  /**
   * Busca entidades por múltiplos IDs
   */
  findByIds(ids: IId<TId>[]): Promise<TEntity[]>

  /**
   * Busca entidades com filtros dinâmicos
   */
  findByFilters(filters: Record<string, unknown>): Promise<TEntity[]>

  /**
   * Busca entidades com filtros e paginação
   */
  findByFiltersWithPagination(
    filters: Record<string, unknown>,
    page: number,
    limit: number,
    orderBy?: string,
    orderDirection?: 'ASC' | 'DESC'
  ): Promise<PaginatedResult<TEntity>>
}

/**
 * Interface para repositórios de agregados
 * @template TAggregate - Tipo do agregado
 * @template TId - Tipo do identificador
 */
export interface IAggregateRepository<TAggregate extends IEntity<TId>, TId = string> extends IRepository<TAggregate, TId> {
  /**
   * Busca um agregado por ID com eventos de domínio
   */
  findByIdWithEvents(id: IId<TId>): Promise<Maybe<TAggregate>>

  /**
   * Salva um agregado e publica seus eventos de domínio
   */
  saveWithEvents(aggregate: TAggregate): Promise<Result<void, Error>>

  /**
   * Busca agregados que satisfazem uma especificação
   */
  findBySpecification(specification: ISpecification<TAggregate>): Promise<TAggregate[]>

  /**
   * Busca agregados com paginação
   */
  findWithPagination(page: number, limit: number, orderBy?: string, orderDirection?: 'ASC' | 'DESC'): Promise<PaginatedResult<TAggregate>>
}

/**
 * Interface para Unit of Work com funcionalidades avançadas
 */
export interface IAdvancedUnitOfWork extends IUnitOfWork {
  /**
   * Executa uma operação dentro de uma transação
   */
  execute<T>(operation: (uow: IUnitOfWork) => Promise<T>): Promise<Result<T, Error>>

  /**
   * Executa múltiplas operações em uma única transação
   */
  executeMultiple<T>(operations: ((uow: IUnitOfWork) => Promise<T>)[]): Promise<Result<T[], Error>>

  /**
   * Registra uma entidade para ser salva
   */
  registerNew<T>(entity: T): void

  /**
   * Registra uma entidade para ser atualizada
   */
  registerDirty<T>(entity: T): void

  /**
   * Registra uma entidade para ser excluída
   */
  registerDeleted<T>(entity: T): void

  /**
   * Limpa todos os registros
   */
  clear(): void

  /**
   * Retorna o número de entidades registradas
   */
  getRegisteredCount(): number
}

/**
 * Interface para repositórios com cache
 * @template TEntity - Tipo da entidade
 * @template TId - Tipo do identificador
 */
export interface ICachedRepository<TEntity extends IEntity<TId>, TId = string> extends IRepository<TEntity, TId> {
  /**
   * Busca uma entidade do cache primeiro, depois do repositório
   */
  findByIdWithCache(id: IId<TId>): Promise<Maybe<TEntity>>

  /**
   * Invalida o cache de uma entidade específica
   */
  invalidateCache(id: IId<TId>): Promise<void>

  /**
   * Invalida todo o cache
   */
  invalidateAllCache(): Promise<void>

  /**
   * Define o TTL do cache
   */
  setCacheTTL(ttl: number): void

  /**
   * Retorna informações sobre o cache
   */
  getCacheInfo(): CacheInfo
}

/**
 * Interface para repositórios com auditoria
 * @template TEntity - Tipo da entidade
 * @template TId - Tipo do identificador
 */
export interface IAuditableRepository<TEntity extends IEntity<TId>, TId = string> extends IRepository<TEntity, TId> {
  /**
   * Busca o histórico de uma entidade
   */
  findHistory(id: IId<TId>): Promise<EntityHistory<TEntity>[]>

  /**
   * Busca uma versão específica de uma entidade
   */
  findByVersion(id: IId<TId>, version: number): Promise<Maybe<TEntity>>

  /**
   * Restaura uma entidade para uma versão específica
   */
  restoreToVersion(id: IId<TId>, version: number): Promise<Result<TEntity, Error>>
}

/**
 * Interface para repositórios com soft delete
 * @template TEntity - Tipo da entidade
 * @template TId - Tipo do identificador
 */
export interface ISoftDeletableRepository<TEntity extends IEntity<TId>, TId = string> extends IRepository<TEntity, TId> {
  /**
   * Exclui logicamente uma entidade
   */
  softDelete(id: IId<TId>, deletedBy?: string): Promise<Result<void, Error>>

  /**
   * Restaura uma entidade excluída logicamente
   */
  restore(id: IId<TId>): Promise<Result<void, Error>>

  /**
   * Busca entidades excluídas logicamente
   */
  findDeleted(): Promise<TEntity[]>

  /**
   * Exclui permanentemente uma entidade
   */
  hardDelete(id: IId<TId>): Promise<Result<void, Error>>
}

/**
 * Interface para repositórios com busca textual
 * @template TEntity - Tipo da entidade
 * @template TId - Tipo do identificador
 */
export interface ISearchableRepository<TEntity extends IEntity<TId>, TId = string> extends IRepository<TEntity, TId> {
  /**
   * Busca entidades por texto
   */
  search(query: string, fields?: string[]): Promise<TEntity[]>

  /**
   * Busca entidades por texto com paginação
   */
  searchWithPagination(query: string, page: number, limit: number, fields?: string[]): Promise<PaginatedResult<TEntity>>

  /**
   * Busca sugerida (autocomplete)
   */
  suggest(query: string, limit?: number): Promise<string[]>
}

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

/**
 * Informações sobre o cache
 */
export interface CacheInfo {
  hitCount: number
  missCount: number
  hitRate: number
  size: number
  maxSize: number
  ttl: number
}

/**
 * Histórico de uma entidade
 */
export interface EntityHistory<T> {
  version: number
  entity: T
  changedBy: string
  changedAt: Date
  changeType: 'CREATE' | 'UPDATE' | 'DELETE'
  changes: Record<string, { from: unknown; to: unknown }>
}

/**
 * Interface para repositórios com métricas
 */
export interface IMetricsRepository {
  /**
   * Retorna métricas de performance
   */
  getMetrics(): RepositoryMetrics

  /**
   * Limpa as métricas
   */
  clearMetrics(): void

  /**
   * Habilita/desabilita coleta de métricas
   */
  setMetricsEnabled(enabled: boolean): void
}

/**
 * Métricas de repositório
 */
export interface RepositoryMetrics {
  operationCounts: Record<string, number>
  averageExecutionTimes: Record<string, number>
  errorCounts: Record<string, number>
  lastExecutionTimes: Record<string, Date>
}

/**
 * Interface para repositórios com batch operations
 * @template TEntity - Tipo da entidade
 * @template TId - Tipo do identificador
 */
export interface IBatchRepository<TEntity extends IEntity<TId>, TId = string> extends IRepository<TEntity, TId> {
  /**
   * Salva múltiplas entidades em lote
   */
  saveBatch(entities: TEntity[]): Promise<Result<void, Error>>

  /**
   * Atualiza múltiplas entidades em lote
   */
  updateBatch(entities: TEntity[]): Promise<Result<void, Error>>

  /**
   * Exclui múltiplas entidades em lote
   */
  deleteBatch(ids: IId<TId>[]): Promise<Result<void, Error>>

  /**
   * Busca múltiplas entidades por IDs em lote
   */
  findByIdsBatch(ids: IId<TId>[]): Promise<TEntity[]>
}

