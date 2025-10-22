# 🏗️ Camada de Domínio - Talent Grid

Esta camada contém toda a lógica de negócio do sistema, implementando os padrões Domain-Driven Design (DDD) e SOLID.

## 📁 Estrutura

```
src/domain/
├── interfaces/          # Interfaces puras do domínio
├── types/               # Tipos base (Result, Either, Maybe, etc.)
├── value-objects/       # Value Objects (ID, ValueObject base)
├── entities/            # Entidades e Aggregate Roots
├── events/              # Sistema de eventos de domínio
├── repositories/        # Interfaces de repositórios
├── validation/          # Sistema de validação
├── specifications/      # Padrão Specification
└── index.ts             # Exportações principais
```

## 🎯 Conceitos Principais

### 1. **Value Objects**
Objetos imutáveis que representam conceitos do domínio baseados em seus valores.

```typescript
import { PrimitiveValueObject } from '@/domain';

class Email extends PrimitiveValueObject {
  constructor(private readonly value: string) {
    super();
    this.validate();
  }

  protected validate(): void {
    if (!this.value || !this.value.includes('@')) {
      throw new ValidationError('Invalid email format');
    }
  }

  protected getPrimitiveValues(): unknown[] {
    return [this.value];
  }

  clone(): Email {
    return new Email(this.value);
  }
}
```

### 2. **Entities**
Objetos com identidade única que podem mudar ao longo do tempo.

```typescript
import { Entity, StringId } from '@/domain';

class User extends Entity {
  constructor(
    id: StringId,
    private name: string,
    private email: Email,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this.validate();
  }

  protected validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new ValidationError('Name is required');
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id.value,
      name: this.name,
      email: this.email.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  clone(updates?: Partial<this>): this {
    return new User(
      this.id,
      updates?.name ?? this.name,
      updates?.email ?? this.email,
      this.createdAt,
      this.updatedAt,
    ) as this;
  }
}
```

### 3. **Aggregate Roots**
Clusters de objetos de domínio tratados como uma unidade.

```typescript
import { AggregateRoot, StringId } from '@/domain';

class UserAggregate extends AggregateRoot {
  private constructor(
    id: StringId,
    private name: string,
    private email: Email,
    version: number = 1,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, version, createdAt, updatedAt);
    this.validate();
  }

  static create(name: string, email: Email): Result<UserAggregate, ValidationError[]> {
    try {
      const id = StringId.generate();
      const user = new UserAggregate(id, name, email);
      
      // Adiciona evento de criação
      user.addDomainEvent(new UserCreatedEvent(id.value, name, email.toString()));
      
      return Result.success(user);
    } catch (error) {
      return Result.failure(error as ValidationError);
    }
  }

  protected validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new ValidationError('Name is required');
    }
  }

  // Métodos de negócio...
}
```

### 4. **Result Pattern**
Para tratamento de erros de forma funcional.

```typescript
import { Result, ValidationError } from '@/domain';

function createUser(name: string, email: string): Result<User, ValidationError[]> {
  const errors: ValidationError[] = [];
  
  if (!name || name.trim().length === 0) {
    errors.push(new ValidationError('Name is required', 'name', name));
  }
  
  if (!email || !email.includes('@')) {
    errors.push(new ValidationError('Invalid email', 'email', email));
  }
  
  if (errors.length > 0) {
    return Result.failure(errors);
  }
  
  return Result.success(new User(name, email));
}

// Uso
const result = createUser('João', 'joao@email.com');
result
  .onSuccess(user => console.log('User created:', user))
  .onFailure(errors => console.error('Validation errors:', errors));
```

### 5. **Specifications**
Para encapsular regras de negócio reutilizáveis.

```typescript
import { Specification, SpecificationBuilder } from '@/domain';

class ActiveUserSpecification extends Specification<User> {
  isSatisfiedBy(user: User): boolean {
    return user.isActive && !user.isDeleted;
  }

  toString(): string {
    return 'ActiveUserSpecification';
  }
}

class UserWithEmailSpecification extends Specification<User> {
  constructor(private readonly email: string) {
    super();
  }

  isSatisfiedBy(user: User): boolean {
    return user.email === this.email;
  }

  toString(): string {
    return `UserWithEmailSpecification(${this.email})`;
  }
}

// Uso
const activeUsersSpec = new ActiveUserSpecification();
const userWithEmailSpec = new UserWithEmailSpecification('joao@email.com');
const combinedSpec = activeUsersSpec.and(userWithEmailSpec);

const users = await userRepository.findBySpecification(combinedSpec);
```

### 6. **Domain Events**
Para comunicação entre agregados.

```typescript
import { DomainEvent } from '@/domain';

class UserCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly name: string,
    public readonly email: string,
  ) {
    super(aggregateId, 1, 'UserCreated');
  }

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      occurredOn: this.occurredOn,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      version: this.version,
      name: this.name,
      email: this.email,
    };
  }
}

class UserCreatedEventHandler extends DomainEventHandler<UserCreatedEvent> {
  async handle(event: UserCreatedEvent): Promise<void> {
    // Enviar email de boas-vindas
    await this.emailService.sendWelcomeEmail(event.email, event.name);
    
    // Log da criação
    console.log(`User created: ${event.name} (${event.email})`);
  }

  protected getEventType(): new (...args: any[]) => UserCreatedEvent {
    return UserCreatedEvent;
  }
}
```

### 7. **Validation System**
Para validação robusta de dados.

```typescript
import { BaseValidator, StringValidator, NumberValidator } from '@/domain';

class UserValidator extends BaseValidator<User> {
  validate(data: unknown): Result<User, ValidationError[]> {
    if (typeof data !== 'object' || data === null) {
      return Result.failure([new ValidationError('Data must be an object', 'data', data)]);
    }

    const obj = data as Record<string, unknown>;
    const errors: ValidationError[] = [];

    // Validar nome
    const nameError = this.validateField(
      obj.name,
      'name',
      [
        RequiredValidator.required('name'),
        StringValidator.notEmpty('name'),
        StringValidator.minLength(2, 'name'),
        StringValidator.maxLength(100, 'name'),
      ],
    );
    if (nameError) errors.push(nameError);

    // Validar email
    const emailError = this.validateField(
      obj.email,
      'email',
      [
        RequiredValidator.required('email'),
        StringValidator.email('email'),
      ],
    );
    if (emailError) errors.push(emailError);

    if (errors.length > 0) {
      return Result.failure(errors);
    }

    return Result.success(new User(obj.name as string, obj.email as string));
  }
}
```

## 🔧 Boas Práticas

### 1. **Imutabilidade**
- Value Objects devem ser imutáveis
- Use `readonly` para propriedades que não devem mudar
- Crie métodos que retornam novas instâncias ao invés de modificar o estado

### 2. **Validação**
- Valide sempre na criação de objetos
- Use o Result pattern para tratamento de erros
- Valide regras de negócio nas entidades e agregados

### 3. **Eventos de Domínio**
- Publique eventos quando algo importante acontece
- Use eventos para comunicação entre agregados
- Mantenha eventos simples e focados

### 4. **Specifications**
- Use para regras de negócio reutilizáveis
- Combine specifications para queries complexas
- Mantenha specifications focadas e testáveis

### 5. **Nomenclatura**
- Use nomes descritivos e do domínio
- Evite termos técnicos quando possível
- Seja consistente com a linguagem ubíqua

## 🧪 Testes

### Exemplo de Teste para Value Object

```typescript
import { describe, it, expect } from 'vitest';
import { Email } from '@/domain';

describe('Email', () => {
  describe('constructor', () => {
    it('should create email when valid email is provided', () => {
      // Arrange
      const validEmail = 'test@example.com';
      
      // Act
      const email = new Email(validEmail);
      
      // Assert
      expect(email).toBeDefined();
      expect(email.toString()).toBe(validEmail);
    });

    it('should throw validation error when invalid email is provided', () => {
      // Arrange
      const invalidEmail = 'invalid-email';
      
      // Act & Assert
      expect(() => new Email(invalidEmail)).toThrow('Invalid email format');
    });
  });

  describe('equals', () => {
    it('should return true when comparing equal emails', () => {
      // Arrange
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');
      
      // Act & Assert
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false when comparing different emails', () => {
      // Arrange
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');
      
      // Act & Assert
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
```

### Exemplo de Teste para Aggregate

```typescript
import { describe, it, expect } from 'vitest';
import { UserAggregate, UserCreatedEvent } from '@/domain';

describe('UserAggregate', () => {
  describe('create', () => {
    it('should create user successfully when valid data is provided', () => {
      // Arrange
      const name = 'João Silva';
      const email = 'joao@example.com';
      
      // Act
      const result = UserAggregate.create(name, email);
      
      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const user = result.value;
        expect(user.name).toBe(name);
        expect(user.email).toBe(email);
        expect(user.hasUncommittedEvents()).toBe(true);
        expect(user.getUncommittedEvents()[0]).toBeInstanceOf(UserCreatedEvent);
      }
    });

    it('should return failure when invalid data is provided', () => {
      // Arrange
      const name = '';
      const email = 'invalid-email';
      
      // Act
      const result = UserAggregate.create(name, email);
      
      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBeDefined();
      }
    });
  });
});
```

## 📚 Recursos Adicionais

- [Domain-Driven Design Reference](https://www.domainlanguage.com/ddd/reference/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Result Pattern](https://en.wikipedia.org/wiki/Result_type)

