import type { IDomainEvent, IDomainEventHandler } from '../interfaces'
import { UuidId } from '../value-objects/id'

/**
 * Classe base para eventos de domínio
 */
export abstract class DomainEvent implements IDomainEvent {
  public readonly eventId: string
  public readonly occurredOn: Date
  public readonly eventType: string
  public readonly aggregateId: string
  public readonly version: number

  constructor(aggregateId: string, version: number, eventType?: string) {
    this.eventId = UuidId.generate().value
    this.occurredOn = new Date()
    this.eventType = eventType || this.constructor.name
    this.aggregateId = aggregateId
    this.version = version
  }

  /**
   * Retorna uma representação string do evento
   */
  toString(): string {
    return `${this.eventType}(id=${this.eventId}, aggregateId=${this.aggregateId}, version=${this.version})`
  }

  /**
   * Retorna os dados do evento para serialização
   */
  abstract toJSON(): Record<string, unknown>
}

/**
 * Classe base para handlers de eventos de domínio
 */
export abstract class DomainEventHandler<T extends DomainEvent = DomainEvent> implements IDomainEventHandler<T> {
  /**
   * Processa o evento de domínio
   */
  abstract handle(event: T): Promise<void>

  /**
   * Verifica se o handler pode processar o evento
   */
  canHandle(event: DomainEvent): boolean {
    return event instanceof this.getEventType()
  }

  /**
   * Retorna o tipo de evento que este handler processa
   */
  protected abstract getEventType(): new (...args: any[]) => T

  /**
   * Retorna o nome do handler
   */
  getHandlerName(): string {
    return this.constructor.name
  }
}

/**
 * Interface para o bus de eventos de domínio
 */
export interface IDomainEventBus {
  /**
   * Publica um evento de domínio
   */
  publish(event: DomainEvent): Promise<void>

  /**
   * Publica múltiplos eventos
   */
  publishAll(events: DomainEvent[]): Promise<void>

  /**
   * Registra um handler para um tipo de evento
   */
  subscribe<T extends DomainEvent>(eventType: new (...args: any[]) => T, handler: DomainEventHandler<T>): void

  /**
   * Remove um handler
   */
  unsubscribe<T extends DomainEvent>(eventType: new (...args: any[]) => T, handler: DomainEventHandler<T>): void

  /**
   * Limpa todos os handlers
   */
  clear(): void
}

/**
 * Implementação simples do bus de eventos de domínio
 */
export class DomainEventBus implements IDomainEventBus {
  private readonly handlers = new Map<string, DomainEventHandler[]>()

  /**
   * Publica um evento de domínio
   */
  async publish(event: DomainEvent): Promise<void> {
    const eventTypeName = event.constructor.name
    const handlers = this.handlers.get(eventTypeName) || []

    for (const handler of handlers) {
      try {
        await handler.handle(event)
      } catch (error) {
        console.error(`Error handling event ${eventTypeName}:`, error)
        // Em uma implementação real, você pode querer usar um sistema de retry
        // ou enviar para uma dead letter queue
      }
    }
  }

  /**
   * Publica múltiplos eventos
   */
  async publishAll(events: DomainEvent[]): Promise<void> {
    const promises = events.map((event) => this.publish(event))
    await Promise.all(promises)
  }

  /**
   * Registra um handler para um tipo de evento
   */
  subscribe<T extends DomainEvent>(eventType: new (...args: any[]) => T, handler: DomainEventHandler<T>): void {
    const eventTypeName = eventType.name

    if (!this.handlers.has(eventTypeName)) {
      this.handlers.set(eventTypeName, [])
    }

    this.handlers.get(eventTypeName)!.push(handler)
  }

  /**
   * Remove um handler
   */
  unsubscribe<T extends DomainEvent>(eventType: new (...args: any[]) => T, handler: DomainEventHandler<T>): void {
    const eventTypeName = eventType.name
    const handlers = this.handlers.get(eventTypeName) || []

    const index = handlers.indexOf(handler)
    if (index > -1) {
      handlers.splice(index, 1)
    }
  }

  /**
   * Limpa todos os handlers
   */
  clear(): void {
    this.handlers.clear()
  }

  /**
   * Retorna o número de handlers registrados para um tipo de evento
   */
  getHandlerCount(eventType: string): number {
    return this.handlers.get(eventType)?.length || 0
  }

  /**
   * Retorna todos os tipos de eventos registrados
   */
  getRegisteredEventTypes(): string[] {
    return Array.from(this.handlers.keys())
  }
}

/**
 * Singleton para o bus de eventos de domínio
 */
export class DomainEventBusSingleton {
  private static instance: IDomainEventBus

  /**
   * Retorna a instância singleton do bus de eventos
   */
  static getInstance(): IDomainEventBus {
    if (!DomainEventBusSingleton.instance) {
      DomainEventBusSingleton.instance = new DomainEventBus()
    }
    return DomainEventBusSingleton.instance
  }

  /**
   * Define uma instância customizada do bus de eventos
   */
  static setInstance(bus: IDomainEventBus): void {
    DomainEventBusSingleton.instance = bus
  }

  /**
   * Reseta a instância singleton
   */
  static reset(): void {
    DomainEventBusSingleton.instance = new DomainEventBus()
  }
}

/**
 * Decorator para registrar handlers de eventos automaticamente
 */
export function EventHandler<T extends DomainEvent>(eventType: new (...args: any[]) => T) {
  return (target: new (...args: any[]) => DomainEventHandler<T>) => {
    const handler = new target()
    const bus = DomainEventBusSingleton.getInstance()
    bus.subscribe(eventType, handler)
  }
}

/**
 * Classe base para eventos de criação de agregados
 */
export abstract class AggregateCreatedEvent extends DomainEvent {
  constructor(aggregateId: string, version: number = 1) {
    super(aggregateId, version)
  }
}

/**
 * Classe base para eventos de atualização de agregados
 */
export abstract class AggregateUpdatedEvent extends DomainEvent {
  constructor(aggregateId: string, version: number) {
    super(aggregateId, version)
  }
}

/**
 * Classe base para eventos de exclusão de agregados
 */
export abstract class AggregateDeletedEvent extends DomainEvent {
  constructor(aggregateId: string, version: number) {
    super(aggregateId, version)
  }
}

