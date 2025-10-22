# 🏢 Talent Grid

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D25.0.0-brightgreen)](https://nodejs.org/)
[![PNPM](https://img.shields.io/badge/pnpm-10.6.2-orange)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue)](https://www.typescriptlang.org/)
[![Turbo](https://img.shields.io/badge/Turbo-2.4.4-purple)](https://turbo.build/)

> **Sistema ERP completo para gestão de Recursos Humanos empresariais**

O Talent Grid é uma solução moderna e robusta para gestão de RH, desenvolvida com arquitetura de monorepo utilizando as melhores práticas de desenvolvimento. O sistema oferece funcionalidades completas desde o cadastramento de funcionários até a gestão avançada de contratos e documentos.

## ✨ Funcionalidades

### 👥 Gestão de Funcionários
- **Cadastramento completo** de funcionários com dados pessoais e profissionais
- **Processo de admissão** automatizado com workflows personalizáveis
- **Gestão de contratos** de experiência com alertas automáticos
- **Histórico completo** de movimentações e alterações

### 📄 Gestão de Contratos
- **Geração automática** de contratos com preenchimento inteligente
- **Templates personalizáveis** para diferentes tipos de contrato
- **Assinatura digital** integrada
- **Calendário de vencimentos** com notificações automáticas

### 💰 Gestão Financeira
- **Upload e distribuição** automática de holerites
- **Cálculos automáticos** de salários e benefícios
- **Relatórios financeiros** detalhados
- **Integração com sistemas** de pagamento

### 📅 Calendário Inteligente
- **Visões personalizadas** de eventos importantes
- **Alertas de término** de contratos de experiência
- **Lembretes de aniversários** e datas especiais
- **Cronograma de pagamentos** automatizado

### 📢 Comunicação
- **Sistema de avisos** e comunicados internos
- **Notificações push** e por email
- **Central de mensagens** integrada

## 🏗️ Arquitetura

### Stack Tecnológica

- **📦 Gerenciamento**: PNPM Workspaces + Turbo
- **🔧 Backend**: TypeScript + Fastify + Prisma
- **🗄️ Banco de Dados**: PostgreSQL
- **🧪 Testes**: Vitest + Coverage
- **📏 Qualidade**: Biome (Linting + Formatting)
- **🏛️ Arquitetura**: SOLID + Domain-Driven Design (DDD)

### Estrutura do Projeto

```
talentgrid/
├── apps/                    # Aplicações principais
│   ├── api/                # API Backend (Fastify + TypeScript)
│   └── web/                # Frontend Web Application
├── packages/               # Pacotes compartilhados
│   └── typescript-config/  # Configurações TypeScript
├── docs/                   # Documentação
└── tools/                  # Scripts e ferramentas
```

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** >= 25.0.0
- **PNPM** >= 10.6.2
- **PostgreSQL** >= 14.0

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/rafaelsantana6/talentgrid.git
   cd talentgrid
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Configure o banco de dados**
   ```bash
   pnpm db:setup
   ```

5. **Execute o projeto em modo desenvolvimento**
   ```bash
   pnpm dev
   ```

## 📋 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia todos os serviços em modo desenvolvimento |
| `pnpm build` | Constrói todos os projetos para produção |
| `pnpm test` | Executa todos os testes |
| `pnpm test:watch` | Executa testes em modo watch |
| `pnpm test:coverage` | Gera relatório de cobertura de testes |
| `pnpm lint` | Executa verificação de código |
| `pnpm lint:fix` | Corrige problemas de linting automaticamente |
| `pnpm format-write` | Formata o código automaticamente |
| `pnpm check-types` | Verifica tipos TypeScript |
| `pnpm clean` | Limpa todos os builds e dependências |

## 🧪 Testes

O projeto utiliza **Vitest** para testes unitários e de integração, seguindo as melhores práticas:

```bash
# Executar todos os testes
pnpm test

# Executar testes com coverage
pnpm test:coverage

# Executar testes em modo watch
pnpm test:watch

# Executar testes de um pacote específico
pnpm --filter api test
```

## 📚 Documentação

- [📖 Guia de Contribuição](docs/CONTRIBUTING.md)
- [🏗️ Arquitetura](docs/ARCHITECTURE.md)
- [🔧 Configuração](docs/SETUP.md)
- [📋 Roadmap](docs/ROADMAP.md)
- [🐛 Reportar Bugs](docs/BUG_REPORTS.md)

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Por favor, leia nosso [Guia de Contribuição](docs/CONTRIBUTING.md) antes de começar.

### Processo de Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código

- **TypeScript** com configurações rigorosas
- **ESLint** + **Prettier** para formatação
- **Conventional Commits** para mensagens de commit
- **Testes obrigatórios** para novas funcionalidades
- **Documentação** atualizada

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🏆 Reconhecimentos

- [Fastify](https://www.fastify.io/) - Framework web rápido e eficiente
- [Prisma](https://www.prisma.io/) - ORM moderno para TypeScript
- [Turbo](https://turbo.build/) - Build system para monorepos
- [Vitest](https://vitest.dev/) - Framework de testes moderno
- [Biome](https://biomejs.dev/) - Ferramenta de linting e formatação

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/rafaelsantana6/talentgrid/issues)
- **Discussões**: [GitHub Discussions](https://github.com/rafaelsantana6/talentgrid/discussions)

## 🗺️ Roadmap

### Versão 1.0 (Q4 2025)
- [x] Estrutura base do monorepo
- [x] Configuração inicial da API
- [ ] Sistema de autenticação
- [ ] CRUD básico de funcionários
- [ ] Interface web inicial

### Versão 1.1 (Q1 2026)
- [ ] Gestão de contratos
- [ ] Sistema de upload de documentos
- [ ] Calendário de eventos
- [ ] Relatórios básicos

### Versão 2.0 (Q2 2026)
- [ ] Assinatura digital
- [ ] Integração com sistemas de pagamento
- [ ] Dashboard avançado
- [ ] API pública

---

<div align="center">
  <strong>Desenvolvido com ❤️ para revolucionar a gestão de RH</strong>
</div>
