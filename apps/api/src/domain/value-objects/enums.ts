/**
 * Enum para Estados Civis
 */
export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
  COMMON_LAW_MARRIAGE = 'common_law_marriage'
}

/**
 * Enum para Gêneros
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non_binary',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

/**
 * Enum para Tipos de Contrato
 */
export enum ContractType {
  CLT = 'clt',
  PJ = 'pj',
  ESTAGIO = 'estagio',
  TRAINEE = 'trainee',
  TERCEIRIZADO = 'terceirizado',
  FREELANCER = 'freelancer',
  TEMPORARIO = 'temporario'
}

/**
 * Enum para Status do Funcionário
 */
export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
  RETIRED = 'retired'
}

/**
 * Enum para Níveis de Escolaridade
 */
export enum EducationLevel {
  FUNDAMENTAL_INCOMPLETO = 'fundamental_incompleto',
  FUNDAMENTAL_COMPLETO = 'fundamental_completo',
  MEDIO_INCOMPLETO = 'medio_incompleto',
  MEDIO_COMPLETO = 'medio_completo',
  SUPERIOR_INCOMPLETO = 'superior_incompleto',
  SUPERIOR_COMPLETO = 'superior_completo',
  POS_GRADUACAO_INCOMPLETO = 'pos_graduacao_incompleto',
  POS_GRADUACAO_COMPLETO = 'pos_graduacao_completo',
  MESTRADO_INCOMPLETO = 'mestrado_incompleto',
  MESTRADO_COMPLETO = 'mestrado_completo',
  DOUTORADO_INCOMPLETO = 'doutorado_incompleto',
  DOUTORADO_COMPLETO = 'doutorado_completo'
}

/**
 * Enum para Tipos de Documento
 */
export enum DocumentType {
  CPF = 'cpf',
  RG = 'rg',
  CNH = 'cnh',
  PASSPORT = 'passport',
  RNE = 'rne',
  CTPS = 'ctps',
  PIS = 'pis',
  TITULO_ELEITOR = 'titulo_eleitor',
  RESERVISTA = 'reservista',
  CERTIDAO_NASCIMENTO = 'certidao_nascimento',
  CERTIDAO_CASAMENTO = 'certidao_casamento',
  CERTIDAO_DIVORCIO = 'certidao_divorcio',
  OUTROS = 'outros'
}

/**
 * Enum para Tipos de Endereço
 */
export enum AddressType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  CORRESPONDENCE = 'correspondence',
  EMERGENCY = 'emergency'
}

/**
 * Enum para Tipos de Contato
 */
export enum ContactType {
  PERSONAL_PHONE = 'personal_phone',
  WORK_PHONE = 'work_phone',
  PERSONAL_EMAIL = 'personal_email',
  WORK_EMAIL = 'work_email',
  EMERGENCY_PHONE = 'emergency_phone',
  EMERGENCY_EMAIL = 'emergency_email'
}

/**
 * Enum para Status de Dependente
 */
export enum DependentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DECEASED = 'deceased'
}

/**
 * Enum para Tipos de Dependente
 */
export enum DependentType {
  SPOUSE = 'spouse',
  CHILD = 'child',
  PARENT = 'parent',
  SIBLING = 'sibling',
  GRANDPARENT = 'grandparent',
  GRANDCHILD = 'grandchild',
  OTHER = 'other'
}

/**
 * Enum para Status de Benefício
 */
export enum BenefitStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired'
}

/**
 * Enum para Tipos de Benefício
 */
export enum BenefitType {
  HEALTH_INSURANCE = 'health_insurance',
  DENTAL_INSURANCE = 'dental_insurance',
  LIFE_INSURANCE = 'life_insurance',
  MEAL_VOUCHER = 'meal_voucher',
  TRANSPORT_VOUCHER = 'transport_voucher',
  FUEL_VOUCHER = 'fuel_voucher',
  EDUCATION_ALLOWANCE = 'education_allowance',
  CHILD_CARE_ALLOWANCE = 'child_care_allowance',
  GYM_PASS = 'gym_pass',
  OTHER = 'other'
}
