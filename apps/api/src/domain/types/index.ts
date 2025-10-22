/**
 * Implementação do padrão Result para tratamento de erros
 * @template T - Tipo do valor de sucesso
 * @template E - Tipo do erro
 */
export class Result<T, E = Error> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E,
  ) {}

  /**
   * Cria um resultado de sucesso
   */
  static success<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value);
  }

  /**
   * Cria um resultado de falha
   */
  static failure<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  /**
   * Combina múltiplos resultados em um único resultado
   */
  static combine<T extends readonly unknown[]>(
    results: { [K in keyof T]: Result<T[K]> },
  ): Result<T> {
    const errors: Error[] = [];
    
    for (const result of results) {
      if (result.isFailure) {
        errors.push(result.error!);
      }
    }

    if (errors.length > 0) {
      return Result.failure(new Error(errors.map(e => e.message).join(', ')));
    }

    const values = results.map(r => r.value!) as T;
    return Result.success(values);
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from failed result');
    }
    return this._value!;
  }

  get error(): E {
    if (this._isSuccess) {
      throw new Error('Cannot get error from successful result');
    }
    return this._error!;
  }

  /**
   * Transforma o valor de sucesso usando uma função
   */
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isFailure) {
      return Result.failure(this.error);
    }
    try {
      return Result.success(fn(this.value));
    } catch (error) {
      return Result.failure(error as E);
    }
  }

  /**
   * Transforma o erro usando uma função
   */
  mapError<F>(fn: (error: E) => F): Result<T, F> {
    if (this.isSuccess) {
      return Result.success(this.value);
    }
    try {
      return Result.failure(fn(this.error));
    } catch (error) {
      return Result.failure(error as F);
    }
  }

  /**
   * Aplica uma função que retorna um Result
   */
  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F> {
    if (this.isFailure) {
      return Result.failure(this.error);
    }
    return fn(this.value);
  }

  /**
   * Executa uma função se o resultado for de sucesso
   */
  onSuccess(fn: (value: T) => void): Result<T, E> {
    if (this.isSuccess) {
      fn(this.value);
    }
    return this;
  }

  /**
   * Executa uma função se o resultado for de falha
   */
  onFailure(fn: (error: E) => void): Result<T, E> {
    if (this.isFailure) {
      fn(this.error);
    }
    return this;
  }

  /**
   * Retorna o valor ou um valor padrão
   */
  getOrElse(defaultValue: T): T {
    return this.isSuccess ? this.value : defaultValue;
  }

  /**
   * Retorna o valor ou executa uma função para obter um valor padrão
   */
  getOrElseGet(fn: () => T): T {
    return this.isSuccess ? this.value : fn();
  }
}

/**
 * Implementação do padrão Either
 * @template L - Tipo do valor à esquerda (erro)
 * @template R - Tipo do valor à direita (sucesso)
 */
export class Either<L, R> {
  private constructor(
    private readonly _isLeft: boolean,
    private readonly _left?: L,
    private readonly _right?: R,
  ) {}

  static left<L, R>(value: L): Either<L, R> {
    return new Either<L, R>(true, value);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either<L, R>(false, undefined, value);
  }

  get isLeft(): boolean {
    return this._isLeft;
  }

  get isRight(): boolean {
    return !this._isLeft;
  }

  get left(): L {
    if (!this._isLeft) {
      throw new Error('Cannot get left value from right Either');
    }
    return this._left!;
  }

  get right(): R {
    if (this._isLeft) {
      throw new Error('Cannot get right value from left Either');
    }
    return this._right!;
  }

  map<U>(fn: (value: R) => U): Either<L, U> {
    if (this.isLeft) {
      return Either.left(this.left);
    }
    try {
      return Either.right(fn(this.right));
    } catch (error) {
      return Either.left(error as L);
    }
  }

  mapLeft<U>(fn: (value: L) => U): Either<U, R> {
    if (this.isRight) {
      return Either.right(this.right);
    }
    try {
      return Either.left(fn(this.left));
    } catch (error) {
      return Either.left(error as U);
    }
  }

  flatMap<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    if (this.isLeft) {
      return Either.left(this.left);
    }
    return fn(this.right);
  }

  fold<U>(leftFn: (value: L) => U, rightFn: (value: R) => U): U {
    if (this.isLeft) {
      return leftFn(this.left);
    }
    return rightFn(this.right);
  }
}

/**
 * Implementação do padrão Maybe/Option
 * @template T - Tipo do valor opcional
 */
export class Maybe<T> {
  private constructor(private readonly _value?: T) {}

  static some<T>(value: T): Maybe<T> {
    if (value === null || value === undefined) {
      throw new Error('Maybe.some() cannot accept null or undefined');
    }
    return new Maybe<T>(value);
  }

  static none<T>(): Maybe<T> {
    return new Maybe<T>();
  }

  static fromNullable<T>(value: T | null | undefined): Maybe<T> {
    return value === null || value === undefined 
      ? Maybe.none<T>() 
      : Maybe.some(value);
  }

  get isSome(): boolean {
    return this._value !== undefined;
  }

  get isNone(): boolean {
    return this._value === undefined;
  }

  get value(): T {
    if (this.isNone) {
      throw new Error('Cannot get value from None');
    }
    return this._value!;
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    if (this.isNone) {
      return Maybe.none<U>();
    }
    try {
      return Maybe.some(fn(this.value));
    } catch {
      return Maybe.none<U>();
    }
  }

  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    if (this.isNone) {
      return Maybe.none<U>();
    }
    return fn(this.value);
  }

  filter(predicate: (value: T) => boolean): Maybe<T> {
    if (this.isNone || !predicate(this.value)) {
      return Maybe.none<T>();
    }
    return this;
  }

  getOrElse(defaultValue: T): T {
    return this.isSome ? this.value : defaultValue;
  }

  getOrElseGet(fn: () => T): T {
    return this.isSome ? this.value : fn();
  }

  orElse(other: Maybe<T>): Maybe<T> {
    return this.isSome ? this : other;
  }
}

/**
 * Classe base para erros de domínio
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly details?: Record<string, unknown>;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Erro de validação
 */
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  
  constructor(
    message: string,
    public readonly field: string,
    public readonly value?: unknown,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.details = details;
  }
}

/**
 * Erro de entidade não encontrada
 */
export class EntityNotFoundError extends DomainError {
  readonly code = 'ENTITY_NOT_FOUND';
  
  constructor(entityType: string, id: string) {
    super(`${entityType} with id ${id} not found`);
  }
}

/**
 * Erro de regra de negócio violada
 */
export class BusinessRuleViolationError extends DomainError {
  readonly code = 'BUSINESS_RULE_VIOLATION';
  
  constructor(rule: string, details?: Record<string, unknown>) {
    super(`Business rule violated: ${rule}`);
    this.details = details;
  }
}

/**
 * Erro de operação não permitida
 */
export class OperationNotAllowedError extends DomainError {
  readonly code = 'OPERATION_NOT_ALLOWED';
  
  constructor(operation: string, reason: string) {
    super(`Operation '${operation}' not allowed: ${reason}`);
  }
}

/**
 * Erro de concorrência
 */
export class ConcurrencyError extends DomainError {
  readonly code = 'CONCURRENCY_ERROR';
  
  constructor(entityType: string, id: string, expectedVersion: number, actualVersion: number) {
    super(`Concurrency conflict for ${entityType} ${id}. Expected version ${expectedVersion}, but got ${actualVersion}`);
  }
}

