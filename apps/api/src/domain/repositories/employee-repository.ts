import type { IRepository, IId } from '../interfaces'
import type { Employee } from '../entities/employee'
import { Maybe } from '../types'

/**
 * Interface para o repositório de Employee
 * Define operações de persistência para o agregado Employee
 */
export interface IEmployeeRepository extends IRepository<Employee> {
  /**
   * Busca funcionário por CPF
   */
  findByCpf(cpf: string): Promise<Maybe<Employee>>

  /**
   * Busca funcionário por email pessoal
   */
  findByPersonalEmail(email: string): Promise<Maybe<Employee>>

  /**
   * Busca funcionário por ID interno da empresa
   */
  findByEmployeeId(employeeId: string): Promise<Maybe<Employee>>

  /**
   * Busca funcionários por departamento
   */
  findByDepartment(department: string): Promise<Employee[]>

  /**
   * Busca funcionários por cargo
   */
  findByPosition(position: string): Promise<Employee[]>

  /**
   * Busca funcionários por status
   */
  findByStatus(status: string): Promise<Employee[]>

  /**
   * Busca funcionários por tipo de contrato
   */
  findByContractType(contractType: string): Promise<Employee[]>

  /**
   * Busca funcionários por gerente
   */
  findByManager(managerId: string): Promise<Employee[]>

  /**
   * Busca funcionários ativos
   */
  findActiveEmployees(): Promise<Employee[]>

  /**
   * Busca funcionários em período de experiência
   */
  findEmployeesOnProbation(): Promise<Employee[]>

  /**
   * Verifica se CPF já existe
   */
  existsByCpf(cpf: string): Promise<boolean>

  /**
   * Verifica se email pessoal já existe
   */
  existsByPersonalEmail(email: string): Promise<boolean>

  /**
   * Verifica se ID interno da empresa já existe
   */
  existsByEmployeeId(employeeId: string): Promise<boolean>

  /**
   * Busca funcionários por nome (busca parcial)
   */
  findByName(name: string): Promise<Employee[]>

  /**
   * Busca funcionários por faixa etária
   */
  findByAgeRange(minAge: number, maxAge: number): Promise<Employee[]>

  /**
   * Busca funcionários por faixa salarial
   */
  findBySalaryRange(minSalary: number, maxSalary: number): Promise<Employee[]>

  /**
   * Busca funcionários por data de contratação
   */
  findByHireDateRange(startDate: Date, endDate: Date): Promise<Employee[]>

  /**
   * Conta total de funcionários
   */
  count(): Promise<number>

  /**
   * Conta funcionários por departamento
   */
  countByDepartment(department: string): Promise<number>

  /**
   * Conta funcionários por status
   */
  countByStatus(status: string): Promise<number>

  /**
   * Busca funcionários com paginação
   */
  findWithPagination(
    page: number,
    limit: number,
    filters?: {
      department?: string
      position?: string
      status?: string
      contractType?: string
    }
  ): Promise<{
    employees: Employee[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>
}
