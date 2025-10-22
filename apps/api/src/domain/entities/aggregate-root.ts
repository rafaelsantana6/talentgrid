import type { IAggregateRoot, IDomainEvent, IId } from '../interfaces'
import { DomainError } from '../types'
import { Entity } from './entity'

/**
 * Classe abstrata base para Aggregate Roots
 * Aggregate Roots são clusters de objetos de domínio tratados como uma unidade
 * @template TId - Tipo do identificador do agregado
 */
export abstract class AggregateRoot<TId = string> extends Entity<TId> implements IAggregateRoot<TId> {
  private readonly _domainEvents: IDomainEvent[] = []
  protected _version: number = 1

  constructor(id: IId<TId>, version: number = 1, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt)
    this._version = version
  }

  /**
   * Retorna a versão atual do agregado
   */
  get version(): number {
    return this._version
  }

  /**
   * Retorna os eventos de domínio não commitados
   */
  getUncommittedEvents(): IDomainEvent[] {
    return [...this._domainEvents]
  }

  /**
   * Marca os eventos como commitados (limpa a lista)
   */
  markEventsAsCommitted(): void {
    this._domainEvents.length = 0
  }

  /**
   * Incrementa a versão do agregado
   */
  incrementVersion(): void {
    this._version++
    this.touch()
  }

  /**
   * Adiciona um evento de domínio ao agregado
   */
  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event)
    this.touch()
  }

  /**
   * Remove um evento de domínio específico
   */
  protected removeDomainEvent(event: IDomainEvent): void {
    const index = this._domainEvents.indexOf(event)
    if (index > -1) {
      this._domainEvents.splice(index, 1)
    }
  }

  /**
   * Limpa todos os eventos de domínio
   */
  protected clearDomainEvents(): void {
    this._domainEvents.length = 0
  }

  /**
   * Verifica se há eventos de domínio não commitados
   */
  hasUncommittedEvents(): boolean {
    return this._domainEvents.length > 0
  }

  /**
   * Retorna o número de eventos não commitados
   */
  getUncommittedEventsCount(): number {
    return this._domainEvents.length
  }
}

/**
 * Classe base para Aggregate Roots com auditoria
 */
export abstract class AuditableAggregateRoot<TId = string> extends AggregateRoot<TId> {
  protected _createdBy?: string
  protected _updatedBy?: string

  constructor(id: IId<TId>, version: number = 1, createdAt?: Date, updatedAt?: Date, createdBy?: string, updatedBy?: string) {
    super(id, version, createdAt, updatedAt)
    this._createdBy = createdBy
    this._updatedBy = updatedBy
  }

  /**
   * Retorna quem criou o agregado
   */
  get createdBy(): string | undefined {
    return this._createdBy
  }

  /**
   * Retorna quem modificou o agregado pela última vez
   */
  get updatedBy(): string | undefined {
    return this._updatedBy
  }

  /**
   * Atualiza a data de modificação e quem modificou
   */
  protected touch(updatedBy?: string): void {
    super.touch()
    this._updatedBy = updatedBy
  }

  /**
   * Define quem criou o agregado
   */
  protected setCreatedBy(createdBy: string): void {
    this._createdBy = createdBy
  }

  /**
   * Define quem modificou o agregado
   */
  protected setUpdatedBy(updatedBy: string): void {
    this._updatedBy = updatedBy
    this.touch(updatedBy)
  }
}

/**
 * Classe base para Aggregate Roots com soft delete
 */
export abstract class SoftDeletableAggregateRoot<TId = string> extends AggregateRoot<TId> {
  protected _deletedAt?: Date
  protected _deletedBy?: string

  constructor(id: IId<TId>, version: number = 1, createdAt?: Date, updatedAt?: Date, deletedAt?: Date, deletedBy?: string) {
    super(id, version, createdAt, updatedAt)
    this._deletedAt = deletedAt
    this._deletedBy = deletedBy
  }

  /**
   * Retorna a data de exclusão
   */
  get deletedAt(): Date | undefined {
    return this._deletedAt ? new Date(this._deletedAt) : undefined
  }

  /**
   * Retorna quem excluiu o agregado
   */
  get deletedBy(): string | undefined {
    return this._deletedBy
  }

  /**
   * Verifica se o agregado foi excluído
   */
  get isDeleted(): boolean {
    return this._deletedAt !== undefined
  }

  /**
   * Exclui o agregado logicamente
   */
  delete(deletedBy?: string): void {
    if (this.isDeleted) {
      throw new DomainError('Aggregate is already deleted')
    }

    this._deletedAt = new Date()
    this._deletedBy = deletedBy
    this.touch()
  }

  /**
   * Restaura o agregado (desfaz a exclusão lógica)
   */
  restore(): void {
    if (!this.isDeleted) {
      throw new DomainError('Aggregate is not deleted')
    }

    this._deletedAt = undefined
    this._deletedBy = undefined
    this.touch()
  }
}

/**
 * Classe base para Aggregate Roots com controle de concorrência otimista
 */
export abstract class OptimisticLockAggregateRoot<TId = string> extends AggregateRoot<TId> {
  /**
   * Verifica se a versão esperada corresponde à versão atual
   */
  checkVersion(expectedVersion: number): void {
    if (this._version !== expectedVersion) {
      throw new DomainError(`Concurrency conflict. Expected version ${expectedVersion}, but got ${this._version}`)
    }
  }

  /**
   * Atualiza a versão para uma versão específica
   * Usado principalmente para carregar agregados do banco de dados
   */
  protected setVersion(version: number): void {
    this._version = version
  }

  /**
   * Verifica se o agregado foi modificado desde uma versão específica
   */
  isModifiedSince(version: number): boolean {
    return this._version > version
  }
}

