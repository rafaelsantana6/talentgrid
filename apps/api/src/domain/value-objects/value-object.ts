import type { IValueObject } from '../interfaces'

/**
 * Classe abstrata base para Value Objects
 * Value Objects são objetos imutáveis que representam conceitos do domínio
 * baseados em seus valores, não em identidade
 */
export abstract class ValueObject implements IValueObject {
  /**
   * Verifica se dois Value Objects são iguais
   * Deve ser implementado pelas classes filhas para comparar os valores específicos
   */
  abstract equals(other: ValueObject): boolean

  /**
   * Retorna o hash code do Value Object
   * Deve ser implementado pelas classes filhas para calcular hash baseado nos valores
   */
  abstract hashCode(): number

  /**
   * Verifica se o Value Object é válido
   * Deve ser implementado pelas classes filhas para validar os valores
   */
  protected abstract validate(): void

  /**
   * Retorna uma representação string do Value Object
   * Pode ser sobrescrito pelas classes filhas para personalizar a representação
   */
  toString(): string {
    return this.constructor.name
  }

  /**
   * Cria uma cópia do Value Object
   * Útil para operações que precisam manter imutabilidade
   */
  abstract clone(): ValueObject

  /**
   * Verifica se o Value Object está vazio ou nulo
   * Pode ser sobrescrito pelas classes filhas
   */
  isEmpty(): boolean {
    return false
  }

  /**
   * Retorna os valores primitivos do Value Object
   * Útil para serialização e comparações
   */
  protected abstract getPrimitiveValues(): unknown[]
}

/**
 * Mixin para Value Objects que precisam de comparação por valores primitivos
 */
export abstract class PrimitiveValueObject extends ValueObject {
  /**
   * Compara dois Value Objects baseado em seus valores primitivos
   */
  equals(other: ValueObject): boolean {
    if (!other) return false
    if (this.constructor !== other.constructor) return false

    const thisValues = this.getPrimitiveValues()
    const otherValues = (other as PrimitiveValueObject).getPrimitiveValues()

    if (thisValues.length !== otherValues.length) return false

    return thisValues.every((value, index) => {
      const otherValue = otherValues[index]

      // Comparação especial para arrays
      if (Array.isArray(value) && Array.isArray(otherValue)) {
        return this.arraysEqual(value, otherValue)
      }

      // Comparação especial para objetos
      if (typeof value === 'object' && typeof otherValue === 'object' && value !== null && otherValue !== null) {
        return this.objectsEqual(value as Record<string, unknown>, otherValue as Record<string, unknown>)
      }

      return value === otherValue
    })
  }

  /**
   * Calcula hash code baseado nos valores primitivos
   */
  hashCode(): number {
    const values = this.getPrimitiveValues()
    return this.calculateHash(values)
  }

  /**
   * Compara dois arrays
   */
  private arraysEqual(arr1: unknown[], arr2: unknown[]): boolean {
    if (arr1.length !== arr2.length) return false

    return arr1.every((item, index) => {
      const otherItem = arr2[index]

      if (Array.isArray(item) && Array.isArray(otherItem)) {
        return this.arraysEqual(item, otherItem)
      }

      if (typeof item === 'object' && typeof otherItem === 'object' && item !== null && otherItem !== null) {
        return this.objectsEqual(item as Record<string, unknown>, otherItem as Record<string, unknown>)
      }

      return item === otherItem
    })
  }

  /**
   * Compara dois objetos
   */
  private objectsEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) return false

    return keys1.every((key) => {
      const value1 = obj1[key]
      const value2 = obj2[key]

      if (Array.isArray(value1) && Array.isArray(value2)) {
        return this.arraysEqual(value1, value2)
      }

      if (typeof value1 === 'object' && typeof value2 === 'object' && value1 !== null && value2 !== null) {
        return this.objectsEqual(value1 as Record<string, unknown>, value2 as Record<string, unknown>)
      }

      return value1 === value2
    })
  }

  /**
   * Calcula hash code para um array de valores
   */
  private calculateHash(values: unknown[]): number {
    return values.reduce((hash: number, value) => {
      const valueHash = this.hashValue(value)
      hash = (hash << 5) - hash + valueHash
      return hash & hash // Convert to 32-bit integer
    }, 0)
  }

  /**
   * Calcula hash para um valor específico
   */
  private hashValue(value: unknown): number {
    if (value === null || value === undefined) return 0

    if (typeof value === 'string') {
      return this.hashString(value)
    }

    if (typeof value === 'number') {
      return Math.floor(value)
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0
    }

    if (Array.isArray(value)) {
      return this.calculateHash(value)
    }

    if (typeof value === 'object') {
      return this.hashString(JSON.stringify(value))
    }

    return 0
  }

  /**
   * Calcula hash para uma string
   */
  private hashString(str: string): number {
    return str.split('').reduce((hash, char) => {
      const charCode = char.charCodeAt(0)
      hash = (hash << 5) - hash + charCode
      return hash & hash // Convert to 32-bit integer
    }, 0)
  }
}

