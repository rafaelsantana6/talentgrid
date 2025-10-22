import { AuditableAggregateRoot } from '../entities/aggregate-root'
import { Id } from '../value-objects/id'
import { Cpf } from '../value-objects/cpf'
import { Email } from '../value-objects/email'
import { Salary } from '../value-objects/salary'
import { Address } from '../value-objects/address'
import {
  MaritalStatus,
  Gender,
  ContractType,
  EmployeeStatus,
  EducationLevel,
  DocumentType,
  AddressType,
  ContactType,
  DependentStatus,
  DependentType,
  BenefitStatus,
  BenefitType
} from '../value-objects/enums'
import { ValidationError, BusinessRuleViolationError } from '../types'

/**
 * Interface para dados de documento
 */
export interface IDocument {
  type: DocumentType
  number: string
  issuingBody?: string
  issueDate?: Date
  expirationDate?: Date
}

/**
 * Interface para dados de contato
 */
export interface IContact {
  type: ContactType
  value: string
  isPrimary: boolean
}

/**
 * Interface para dados de benefício
 */
export interface IBenefit {
  type: BenefitType
  status: BenefitStatus
  startDate: Date
  endDate?: Date
  value?: number
  description?: string
}

/**
 * Interface para dados de experiência profissional
 */
export interface IWorkExperience {
  company: string
  position: string
  startDate: Date
  endDate?: Date
  description?: string
  isCurrent: boolean
}

/**
 * Interface para dados de formação acadêmica
 */
export interface IEducation {
  institution: string
  course: string
  level: EducationLevel
  startDate: Date
  endDate?: Date
  isCompleted: boolean
  description?: string
}

/**
 * Agregado Employee
 * Representa um funcionário completo com todos os dados necessários para sistemas ERP de RH
 */
export class Employee extends AuditableAggregateRoot {
  // Dados pessoais básicos
  private _firstName: string
  private _lastName: string
  private _birthDate: Date
  private _gender: Gender
  private _maritalStatus: MaritalStatus
  private _nationality: string
  private _placeOfBirth: string

  // Documentos
  private _cpf: Cpf
  private _rg?: Rg
  private _cnh?: Cnh
  private _passport?: string
  private _pis?: string
  private _ctps?: string
  private _tituloEleitor?: string
  private _reservista?: string
  private _additionalDocuments: IDocument[]

  // Contatos
  private _personalEmail: Email
  private _workEmail?: Email
  private _personalPhone?: Phone
  private _workPhone?: Phone
  private _emergencyPhone?: Phone
  private _additionalContacts: IContact[]

  // Endereços
  private _residentialAddress: Address
  private _mailingAddress?: Address
  private _additionalAddresses: Address[]

  // Dados profissionais
  private _employeeId: string
  private _position: string
  private _department: string
  private _managerId?: string
  private _contractType: ContractType
  private _status: EmployeeStatus
  private _hireDate: Date
  private _terminationDate?: Date
  private _probationEndDate?: Date
  private _salary: Salary
  private _workSchedule: string
  private _workLocation: string

  // Dados acadêmicos e profissionais
  private _educationLevel: EducationLevel
  private _educationHistory: IEducation[]
  private _workExperience: IWorkExperience[]
  private _skills: string[]
  private _certifications: string[]

  // Dependentes
  private _dependents: Dependent[]

  // Benefícios
  private _benefits: IBenefit[]

  // Dados bancários
  private _bankName?: string
  private _bankCode?: string
  private _agency?: string
  private _account?: string
  private _accountType?: string

  // Dados adicionais
  private _notes?: string
  private _tags: string[]
  private _customFields: Record<string, unknown>

  constructor(
    id: Id,
    firstName: string,
    lastName: string,
    birthDate: Date,
    gender: Gender,
    maritalStatus: MaritalStatus,
    nationality: string,
    placeOfBirth: string,
    cpf: Cpf,
    personalEmail: Email,
    residentialAddress: Address,
    employeeId: string,
    position: string,
    department: string,
    contractType: ContractType,
    status: EmployeeStatus,
    hireDate: Date,
    salary: Salary,
    workSchedule: string,
    workLocation: string,
    educationLevel: EducationLevel,
    version: number = 1,
    createdAt?: Date,
    updatedAt?: Date,
    createdBy?: string,
    updatedBy?: string
  ) {
    super(id, version, createdAt, updatedAt, createdBy, updatedBy)
    
    this._firstName = firstName
    this._lastName = lastName
    this._birthDate = birthDate
    this._gender = gender
    this._maritalStatus = maritalStatus
    this._nationality = nationality
    this._placeOfBirth = placeOfBirth
    this._cpf = cpf
    this._personalEmail = personalEmail
    this._residentialAddress = residentialAddress
    this._employeeId = employeeId
    this._position = position
    this._department = department
    this._contractType = contractType
    this._status = status
    this._hireDate = hireDate
    this._salary = salary
    this._workSchedule = workSchedule
    this._workLocation = workLocation
    this._educationLevel = educationLevel

    // Inicializa arrays e objetos opcionais
    this._additionalDocuments = []
    this._additionalContacts = []
    this._additionalAddresses = []
    this._educationHistory = []
    this._workExperience = []
    this._skills = []
    this._certifications = []
    this._dependents = []
    this._benefits = []
    this._tags = []
    this._customFields = {}

    this.validate()
  }

  // Getters para dados pessoais básicos
  get firstName(): string {
    return this._firstName
  }

  get lastName(): string {
    return this._lastName
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`
  }

  get birthDate(): Date {
    return new Date(this._birthDate)
  }

  get gender(): Gender {
    return this._gender
  }

  get maritalStatus(): MaritalStatus {
    return this._maritalStatus
  }

  get nationality(): string {
    return this._nationality
  }

  get placeOfBirth(): string {
    return this._placeOfBirth
  }

  // Getters para documentos
  get cpf(): Cpf {
    return this._cpf
  }

  get rg(): Rg | undefined {
    return this._rg
  }

  get cnh(): Cnh | undefined {
    return this._cnh
  }

  get passport(): string | undefined {
    return this._passport
  }

  get pis(): string | undefined {
    return this._pis
  }

  get ctps(): string | undefined {
    return this._ctps
  }

  get tituloEleitor(): string | undefined {
    return this._tituloEleitor
  }

  get reservista(): string | undefined {
    return this._reservista
  }

  get additionalDocuments(): readonly IDocument[] {
    return [...this._additionalDocuments]
  }

  // Getters para contatos
  get personalEmail(): Email {
    return this._personalEmail
  }

  get workEmail(): Email | undefined {
    return this._workEmail
  }

  get personalPhone(): Phone | undefined {
    return this._personalPhone
  }

  get workPhone(): Phone | undefined {
    return this._workPhone
  }

  get emergencyPhone(): Phone | undefined {
    return this._emergencyPhone
  }

  get additionalContacts(): readonly IContact[] {
    return [...this._additionalContacts]
  }

  // Getters para endereços
  get residentialAddress(): Address {
    return this._residentialAddress
  }

  get mailingAddress(): Address | undefined {
    return this._mailingAddress
  }

  get additionalAddresses(): readonly Address[] {
    return [...this._additionalAddresses]
  }

  // Getters para dados profissionais
  get employeeId(): string {
    return this._employeeId
  }

  get position(): string {
    return this._position
  }

  get department(): string {
    return this._department
  }

  get managerId(): string | undefined {
    return this._managerId
  }

  get contractType(): ContractType {
    return this._contractType
  }

  get status(): EmployeeStatus {
    return this._status
  }

  get hireDate(): Date {
    return new Date(this._hireDate)
  }

  get terminationDate(): Date | undefined {
    return this._terminationDate ? new Date(this._terminationDate) : undefined
  }

  get probationEndDate(): Date | undefined {
    return this._probationEndDate ? new Date(this._probationEndDate) : undefined
  }

  get salary(): Salary {
    return this._salary
  }

  get workSchedule(): string {
    return this._workSchedule
  }

  get workLocation(): string {
    return this._workLocation
  }

  // Getters para dados acadêmicos e profissionais
  get educationLevel(): EducationLevel {
    return this._educationLevel
  }

  get educationHistory(): readonly IEducation[] {
    return [...this._educationHistory]
  }

  get workExperience(): readonly IWorkExperience[] {
    return [...this._workExperience]
  }

  get skills(): readonly string[] {
    return [...this._skills]
  }

  get certifications(): readonly string[] {
    return [...this._certifications]
  }

  // Getters para dependentes e benefícios
  get dependents(): readonly Dependent[] {
    return [...this._dependents]
  }

  get benefits(): readonly IBenefit[] {
    return [...this._benefits]
  }

  // Getters para dados bancários
  get bankName(): string | undefined {
    return this._bankName
  }

  get bankCode(): string | undefined {
    return this._bankCode
  }

  get agency(): string | undefined {
    return this._agency
  }

  get account(): string | undefined {
    return this._account
  }

  get accountType(): string | undefined {
    return this._accountType
  }

  // Getters para dados adicionais
  get notes(): string | undefined {
    return this._notes
  }

  get tags(): readonly string[] {
    return [...this._tags]
  }

  get customFields(): Readonly<Record<string, unknown>> {
    return { ...this._customFields }
  }

  /**
   * Calcula a idade do funcionário
   */
  get age(): number {
    const today = new Date()
    const birthDate = this._birthDate
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  /**
   * Verifica se o funcionário está ativo
   */
  get isActive(): boolean {
    return this._status === EmployeeStatus.ACTIVE
  }

  /**
   * Verifica se o funcionário está em período de experiência
   */
  get isOnProbation(): boolean {
    if (!this._probationEndDate) return false
    return new Date() <= this._probationEndDate
  }

  /**
   * Valida o agregado Employee
   */
  protected validate(): void {
    this.validateBasicData()
    this.validateProfessionalData()
    this.validateBusinessRules()
  }

  /**
   * Valida dados básicos
   */
  private validateBasicData(): void {
    if (!this._firstName || this._firstName.trim().length < 2) {
      throw new ValidationError('First name must have at least 2 characters', 'firstName', this._firstName)
    }

    if (!this._lastName || this._lastName.trim().length < 2) {
      throw new ValidationError('Last name must have at least 2 characters', 'lastName', this._lastName)
    }

    if (!(this._birthDate instanceof Date) || Number.isNaN(this._birthDate.getTime())) {
      throw new ValidationError('Birth date must be a valid date', 'birthDate', this._birthDate)
    }

    const today = new Date()
    if (this._birthDate > today) {
      throw new ValidationError('Birth date cannot be in the future', 'birthDate', this._birthDate)
    }

    // Verifica idade mínima para trabalho (16 anos)
    const minAge = 16
    const minBirthDate = new Date()
    minBirthDate.setFullYear(today.getFullYear() - minAge)
    
    if (this._birthDate > minBirthDate) {
      throw new ValidationError(`Employee must be at least ${minAge} years old`, 'birthDate', this._birthDate)
    }

    if (!this._nationality || this._nationality.trim().length < 2) {
      throw new ValidationError('Nationality must have at least 2 characters', 'nationality', this._nationality)
    }

    if (!this._placeOfBirth || this._placeOfBirth.trim().length < 2) {
      throw new ValidationError('Place of birth must have at least 2 characters', 'placeOfBirth', this._placeOfBirth)
    }
  }

  /**
   * Valida dados profissionais
   */
  private validateProfessionalData(): void {
    if (!this._employeeId || this._employeeId.trim().length < 1) {
      throw new ValidationError('Employee ID cannot be empty', 'employeeId', this._employeeId)
    }

    if (!this._position || this._position.trim().length < 2) {
      throw new ValidationError('Position must have at least 2 characters', 'position', this._position)
    }

    if (!this._department || this._department.trim().length < 2) {
      throw new ValidationError('Department must have at least 2 characters', 'department', this._department)
    }

    if (!(this._hireDate instanceof Date) || Number.isNaN(this._hireDate.getTime())) {
      throw new ValidationError('Hire date must be a valid date', 'hireDate', this._hireDate)
    }

    const today = new Date()
    if (this._hireDate > today) {
      throw new ValidationError('Hire date cannot be in the future', 'hireDate', this._hireDate)
    }

    if (!this._workSchedule || this._workSchedule.trim().length < 1) {
      throw new ValidationError('Work schedule cannot be empty', 'workSchedule', this._workSchedule)
    }

    if (!this._workLocation || this._workLocation.trim().length < 2) {
      throw new ValidationError('Work location must have at least 2 characters', 'workLocation', this._workLocation)
    }
  }

  /**
   * Valida regras de negócio
   */
  private validateBusinessRules(): void {
    // Verifica se data de demissão é posterior à data de contratação
    if (this._terminationDate && this._terminationDate <= this._hireDate) {
      throw new BusinessRuleViolationError('Termination date must be after hire date')
    }

    // Verifica se data de fim de experiência é posterior à data de contratação
    if (this._probationEndDate && this._probationEndDate <= this._hireDate) {
      throw new BusinessRuleViolationError('Probation end date must be after hire date')
    }

    // Verifica se funcionário demitido não pode estar ativo
    if (this._status === EmployeeStatus.TERMINATED && this._terminationDate) {
      const today = new Date()
      if (this._terminationDate > today) {
        throw new BusinessRuleViolationError('Terminated employee cannot have future termination date')
      }
    }
  }

  // Métodos para atualizar dados pessoais
  updatePersonalData(
    firstName: string,
    lastName: string,
    maritalStatus: MaritalStatus,
    nationality: string,
    placeOfBirth: string,
    updatedBy?: string
  ): void {
    this._firstName = firstName
    this._lastName = lastName
    this._maritalStatus = maritalStatus
    this._nationality = nationality
    this._placeOfBirth = placeOfBirth
    this.touch(updatedBy)
    this.validate()
  }

  // Métodos para documentos
  addDocument(document: IDocument, updatedBy?: string): void {
    this._additionalDocuments.push(document)
    this.touch(updatedBy)
  }

  removeDocument(documentType: DocumentType, updatedBy?: string): void {
    const index = this._additionalDocuments.findIndex(doc => doc.type === documentType)
    if (index > -1) {
      this._additionalDocuments.splice(index, 1)
      this.touch(updatedBy)
    }
  }

  // Métodos para contatos
  addContact(contact: IContact, updatedBy?: string): void {
    this._additionalContacts.push(contact)
    this.touch(updatedBy)
  }

  removeContact(contactType: ContactType, updatedBy?: string): void {
    const index = this._additionalContacts.findIndex(contact => contact.type === contactType)
    if (index > -1) {
      this._additionalContacts.splice(index, 1)
      this.touch(updatedBy)
    }
  }

  // Métodos para endereços
  addAddress(address: Address, updatedBy?: string): void {
    this._additionalAddresses.push(address)
    this.touch(updatedBy)
  }

  removeAddress(addressType: AddressType, updatedBy?: string): void {
    const index = this._additionalAddresses.findIndex(addr => addr.type === addressType)
    if (index > -1) {
      this._additionalAddresses.splice(index, 1)
      this.touch(updatedBy)
    }
  }

  // Métodos para dependentes
  addDependent(dependent: Dependent, updatedBy?: string): void {
    this._dependents.push(dependent)
    this.touch(updatedBy)
  }

  removeDependent(dependentName: string, updatedBy?: string): void {
    const index = this._dependents.findIndex(dep => dep.name === dependentName)
    if (index > -1) {
      this._dependents.splice(index, 1)
      this.touch(updatedBy)
    }
  }

  // Métodos para benefícios
  addBenefit(benefit: IBenefit, updatedBy?: string): void {
    this._benefits.push(benefit)
    this.touch(updatedBy)
  }

  removeBenefit(benefitType: BenefitType, updatedBy?: string): void {
    const index = this._benefits.findIndex(benefit => benefit.type === benefitType)
    if (index > -1) {
      this._benefits.splice(index, 1)
      this.touch(updatedBy)
    }
  }

  // Métodos para atualizar dados profissionais
  updatePosition(position: string, department: string, updatedBy?: string): void {
    this._position = position
    this._department = department
    this.touch(updatedBy)
    this.validate()
  }

  updateSalary(salary: Salary, updatedBy?: string): void {
    this._salary = salary
    this.touch(updatedBy)
    this.validate()
  }

  terminate(terminationDate: Date, updatedBy?: string): void {
    this._status = EmployeeStatus.TERMINATED
    this._terminationDate = terminationDate
    this.touch(updatedBy)
    this.validate()
  }

  // Métodos para serialização
  toJSON(): Record<string, unknown> {
    return {
      id: this.id.value,
      firstName: this._firstName,
      lastName: this._lastName,
      fullName: this.fullName,
      birthDate: this._birthDate.toISOString(),
      age: this.age,
      gender: this._gender,
      maritalStatus: this._maritalStatus,
      nationality: this._nationality,
      placeOfBirth: this._placeOfBirth,
      cpf: this._cpf.value,
      personalEmail: this._personalEmail.value,
      employeeId: this._employeeId,
      position: this._position,
      department: this._department,
      contractType: this._contractType,
      status: this._status,
      hireDate: this._hireDate.toISOString(),
      salary: this._salary.value,
      workSchedule: this._workSchedule,
      workLocation: this._workLocation,
      educationLevel: this._educationLevel,
      isActive: this.isActive,
      isOnProbation: this.isOnProbation,
      version: this.version,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      createdBy: this.createdBy,
      updatedBy: this.updatedBy
    }
  }

  clone(updates?: Partial<this>): this {
    // Implementação simplificada - em um cenário real seria mais complexa
    const cloned = new Employee(
      this.id as Id,
      this._firstName,
      this._lastName,
      this._birthDate,
      this._gender,
      this._maritalStatus,
      this._nationality,
      this._placeOfBirth,
      this._cpf,
      this._personalEmail,
      this._residentialAddress,
      this._employeeId,
      this._position,
      this._department,
      this._contractType,
      this._status,
      this._hireDate,
      this._salary,
      this._workSchedule,
      this._workLocation,
      this._educationLevel,
      this.version,
      this.createdAt,
      this.updatedAt,
      this.createdBy,
      this.updatedBy
    ) as this

    // Aplica atualizações se fornecidas
    if (updates) {
      // Implementar lógica de atualização baseada nos campos fornecidos
    }

    return cloned
  }
}
