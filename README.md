# 📅 Sistema de agendamentos

Este repositório contém um sistema de agendamentos com backend em **Nest.js** e frontend em **Next.js**. O sistema possibilita que usuários comuns agendem serviços e visualizem seus agendamentos, enquanto administradores podem criar, listar e excluir serviços.

## Funcionalidades

### Autenticação

- [x] - **Registro de Usuário:**
  - Cadastro com email e senha
- [x] - **Login de Usuário:**
  - Geração de token JWT
- [x] - **Validação de Token JWT:**
  - Endpoints protegidos verificam a validade do token (armazenado em cookie HTTP-only)

### Funcionalidades para Usuário Comum

- [x] - **Listagem de Serviços:**
  - Exibe nome, duração, preço e horários de funcionamento dos serviços
- [x] - **Agendamento de Serviço:**
  - Valida que o agendamento não seja para um horário passado e que o slot esteja disponível (não haja conflito com agendamentos já existentes)
- [x] - **Listagem de Agendamentos do Usuário:**
  - Retorna os agendamentos do usuário autenticado, incluindo dados do serviço

### Funcionalidades para Administrador

- [x] - **Criação de Serviços:**
  - Exibe nome, duração, preço e horários de funcionamento dos serviços
- [x] - **Listagem Completa de Serviços:**
  - Permite a visualização de todos os serviços com seus detalhes
- [x] - **Exclusão de Serviços:**
  - Permite que o administrador exclua serviços

## Detalhes técnicos

### Backend Nestj.js

- Utiliza JWT para autenticação e cookies HTTP-only para armazenar o token
- Prisma é usado como ORM e SQLite para o armazenamento dos dados
- Horários são tratados em UTC no backend e convertidos para o fuso local na exibição, onde necessário

### Frontend em Next.js

- Utiliza a versão 15.1.7 com app router
- Tailwind 4 é utlizado para estilização junto com Shadcn
- Possui integração com Context API para gerenciamento de autenticação

# 🔌Como rodar o projeto localmente

### Pré-requisitos

- **Node.js** (v18 min, v20 ideal) e **npm** (v10.5.0 ideal) instalados.
- **Git** instalado

## Passos para execução

Foi utilizado linux ubuntu 24 com terminal bash para realização deste tutorial.

**1.** Clone o repositório. Pode ser por HTTP ou SSH se preferir

```bash
git clone https://github.com/ioanefaumui/sistema-de-agendamentos.git
```
