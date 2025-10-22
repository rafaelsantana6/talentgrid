# 🚀 CI/CD Pipeline - Talent Grid

Este documento descreve o pipeline de CI/CD implementado para o projeto Talent Grid usando GitHub Actions.

## 📋 Visão Geral

O pipeline está dividido em vários workflows que garantem a qualidade, segurança e confiabilidade do código:

- **CI/CD Pipeline** - Workflow principal
- **Value Objects Tests** - Testes específicos dos Value Objects
- **Deploy** - Deploy automático
- **Quality Gate** - Análise de qualidade e performance

## 🔄 Workflows

### 1. CI/CD Pipeline (`ci.yml`)

**Triggers:**
- Push para `main` ou `develop`
- Pull requests para `main` ou `develop`

**Jobs:**
- **Code Quality** - Linting e formatação
- **Test API** - Testes da API com cobertura
- **Test Web** - Testes do frontend (quando existir)
- **Build** - Build da aplicação
- **Security** - Análise de segurança

### 2. Value Objects Tests (`value-objects-tests.yml`)

**Triggers:**
- Mudanças em Value Objects, tipos ou validação
- Pull requests com mudanças no domínio

**Jobs:**
- **Value Objects Tests** - Testes paralelos por Value Object
- **Aggregate Tests** - Testes do agregado Employee
- **Domain Integration** - Testes de integração do domínio

### 3. Deploy (`deploy.yml`)

**Triggers:**
- Push para `main`
- Sucesso do CI/CD Pipeline

**Jobs:**
- **Deploy Staging** - Deploy para ambiente de staging
- **Deploy Production** - Deploy para produção com release

### 4. Quality Gate (`quality-gate.yml`)

**Triggers:**
- Push para `main` ou `develop`
- Pull requests

**Jobs:**
- **Code Quality Analysis** - Análise com Biome
- **Performance Tests** - Testes de performance
- **Dependency Analysis** - Análise de dependências
- **Bundle Analysis** - Análise do bundle
- **Quality Gate** - Decisão final de qualidade

## 🛠️ Configuração

### Pré-requisitos

1. **Node.js 20** - Versão LTS
2. **PNPM 8** - Gerenciador de pacotes
3. **GitHub Actions** - Plataforma de CI/CD

### Variáveis de Ambiente

```yaml
env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'
```

### Cache

O pipeline utiliza cache inteligente para:
- Dependências do PNPM
- Build artifacts
- Test results

## 📊 Relatórios e Métricas

### Cobertura de Testes

- **API**: Cobertura completa dos Value Objects
- **Web**: Cobertura do frontend (quando aplicável)
- **Upload**: Relatórios enviados para Codecov

### Qualidade de Código

- **Biome**: Análise de linting e formatação
- **Complexity**: Análise de complexidade ciclomática
- **Security**: Auditoria de dependências
- **Performance**: Métricas de performance

### Artefatos

Todos os workflows geram artefatos:
- Relatórios de cobertura
- Análises de qualidade
- Build artifacts
- Logs de execução

## 🔒 Segurança

### Proteções

- **Staging**: 1 revisor obrigatório
- **Production**: 2 revisores obrigatórios + 5min de espera
- **Audit**: Verificação de vulnerabilidades
- **Dependencies**: Análise de dependências

### Permissões

- **Fork PRs**: Permitidos com limitações
- **Secrets**: Gerenciados via GitHub Secrets
- **Environments**: Protegidos por regras

## 🚀 Deploy

### Ambientes

1. **Staging** - Deploy automático após testes
2. **Production** - Deploy após aprovação manual

### Processo

1. **Build** - Compilação da aplicação
2. **Test** - Execução de todos os testes
3. **Quality Gate** - Verificação de qualidade
4. **Deploy** - Deploy para o ambiente
5. **Release** - Criação de release (produção)

## 📈 Monitoramento

### Status Checks

- ✅ **Code Quality** - Linting e formatação
- ✅ **Tests** - Todos os testes passando
- ✅ **Security** - Sem vulnerabilidades críticas
- ✅ **Build** - Build bem-sucedido

### Notificações

- **Slack/Teams** - Notificações de status
- **Email** - Relatórios de cobertura
- **GitHub** - Status checks nos PRs

## 🔧 Troubleshooting

### Problemas Comuns

1. **Cache Issues**
   ```bash
   # Limpar cache do PNPM
   pnpm store prune
   ```

2. **Test Failures**
   ```bash
   # Executar testes localmente
   pnpm test
   ```

3. **Build Failures**
   ```bash
   # Verificar dependências
   pnpm install
   pnpm build
   ```

### Logs

Todos os logs estão disponíveis em:
- GitHub Actions → Workflow runs
- Artefatos de cada job
- Relatórios de cobertura

## 📚 Recursos Adicionais

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PNPM Documentation](https://pnpm.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Biome Documentation](https://biomejs.dev/)

## 🤝 Contribuição

Para contribuir com melhorias no pipeline:

1. Crie uma branch feature
2. Implemente as mudanças
3. Teste localmente
4. Abra um Pull Request
5. Aguarde aprovação e merge

---

**Última atualização:** $(date)
**Versão do Pipeline:** 1.0.0
