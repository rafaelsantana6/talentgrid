import type { IEntity, IId } from '../interfaces'

/**
 * Classe abstrata base para Entidades
 * Entidades são objetos com identidade única que podem mudar ao longo do tempo
 * @template TId - Tipo do identificador da entidade
 */
export abstract class Entity<TId = string> implements IEntity<TId> {
  protected readonly _createdAt: Date
  protected _updatedAt: Date

  constructor(
    protected readonly _id: IId<TId>,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this._createdAt = createdAt || new Date()
    this._updatedAt = updatedAt || new Date()
    this.validate()
  }

  /**
   * Retorna o ID da entidade
   */
  get id(): IId<TId> {
    return this._id
  }

  /**
   * Retorna a data de criação da entidade
   */
  get createdAt(): Date {
    return new Date(this._createdAt)
  }

  /**
   * Retorna a data da última atualização da entidade
   */
  get updatedAt(): Date {
    return new Date(this._updatedAt)
  }

  /**
   * Verifica se duas entidades são iguais baseado no ID
   */
  equals(other: Entity<TId>): boolean {
    if (!other) return false
    if (this.constructor !== other.constructor) return false
    return this._id.equals(other._id)
  }

  /**
   * Retorna o hash code da entidade baseado no ID
   */
  hashCode(): number {
    return this._id.hashCode()
  }

  /**
   * Valida a entidade
   * Deve ser implementado pelas classes filhas
   */
  protected abstract validate(): void

  /**
   * Atualiza a data de modificação
   * Deve ser chamado sempre que a entidade for modificada
   */
  protected touch(): void {
    this._updatedAt = new Date()
  }

  /**
   * Retorna uma representação string da entidade
   */
  toString(): string {
    return `${this.constructor.name}(id=${this._id.toString()})`
  }

  /**
   * Verifica se a entidade é nova (nunca foi persistida)
   * Pode ser sobrescrito pelas classes filhas para implementar lógica específica
   */
  isNew(): boolean {
    return this._createdAt.getTime() === this._updatedAt.getTime()
  }

  /**
   * Retorna os dados da entidade para serialização
   * Deve ser implementado pelas classes filhas
   */
  abstract toJSON(): Record<string, unknown>

  /**
   * Cria uma cópia da entidade com novos valores
   * Útil para operações de atualização
   */
  abstract clone(updates?: Partial<this>): this
}

/**
 * Classe base para entidades com auditoria
 * Inclui campos para rastrear quem criou e modificou a entidade
 */
export abstract class AuditableEntity<TId = string> extends Entity<TId> {
  protected _createdBy?: string
  protected _updatedBy?: string

  constructor(id: IId<TId>, createdAt?: Date, updatedAt?: Date, createdBy?: string, updatedBy?: string) {
    super(id, createdAt, updatedAt)
    this._createdBy = createdBy
    this._updatedBy = updatedBy
  }

  /**
   * Retorna quem criou a entidade
   */
  get createdBy(): string | undefined {
    return this._createdBy
  }

  /**
   * Retorna quem modificou a entidade pela última vez
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
   * Define quem criou a entidade
   */
  protected setCreatedBy(createdBy: string): void {
    this._createdBy = createdBy
  }

  /**
   * Define quem modificou a entidade
   */
  protected setUpdatedBy(updatedBy: string): void {
    this._updatedBy = updatedBy
    this.touch(updatedBy)
  }
}

/**
 * Classe base para entidades com versionamento
 * Inclui controle de versão para detecção de conflitos de concorrência
 */
export abstract class VersionedEntity<TId = string> extends Entity<TId> {
  protected _version: number

  constructor(id: IId<TId>, version: number = 1, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt)
    this._version = version
  }

  /**
   * Retorna a versão atual da entidade
   */
  get version(): number {
    return this._version
  }

  /**
   * Incrementa a versão da entidade
   * Deve ser chamado sempre que a entidade for modificada
   */
  protected incrementVersion(): void {
    this._version++
    this.touch()
  }

  /**
   * Define a versão da entidade
   * Usado principalmente para carregar entidades do banco de dados
   */
  protected setVersion(version: number): void {
    this._version = version
  }

  /**
   * Verifica se a entidade foi modificada desde uma versão específica
   */
  isModifiedSince(version: number): boolean {
    return this._version > version
  }
}

/**
 * Classe base para entidades com soft delete
 * Inclui funcionalidade para exclusão lógica
 */
export abstract class SoftDeletableEntity<TId = string> extends Entity<TId> {
  protected _deletedAt?: Date
  protected _deletedBy?: string

  constructor(id: IId<TId>, createdAt?: Date, updatedAt?: Date, deletedAt?: Date, deletedBy?: string) {
    super(id, createdAt, updatedAt)
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
   * Retorna quem excluiu a entidade
   */
  get deletedBy(): string | undefined {
    return this._deletedBy
  }

  /**
   * Verifica se a entidade foi excluída
   */
  get isDeleted(): boolean {
    return this._deletedAt !== undefined
  }

  /**
   * Exclui a entidade logicamente
   */
  delete(deletedBy?: string): void {
    if (this.isDeleted) {
      throw new Error('Entity is already deleted')
    }

    this._deletedAt = new Date()
    this._deletedBy = deletedBy
    this.touch()
  }

  /**
   * Restaura a entidade (desfaz a exclusão lógica)
   */
  restore(): void {
    if (!this.isDeleted) {
      throw new Error('Entity is not deleted')
    }

    this._deletedAt = undefined
    this._deletedBy = undefined
    this.touch()
  }
}

