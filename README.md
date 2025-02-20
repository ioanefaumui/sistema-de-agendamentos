# 📅 Sistema de agendamentos

Este repositório contém um sistema de agendamentos com backend em **Nest.js** e frontend em **Next.js**. O sistema possibilita que usuários comuns agendem serviços e visualizem seus agendamentos, enquanto administradores podem criar, listar e excluir serviços.

## Vídeo

[scrnli_9Hgu926WlnYS5v.webm](https://github.com/user-attachments/assets/1842a266-6178-4590-b3ec-3bd41f1ba58f)

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

- **Node.js** (v18 min, v20 ideal) e **npm** (v10.8.2 ideal) instalados.
- **Docker** para o banco de dados

## Passos para execução

Foi utilizado linux ubuntu 24 com terminal bash para realização deste tutorial.

**1. Clone o repositório. Pode ser por HTTP ou SSH se preferir:**

```bash
git clone https://github.com/ioanefaumui/sistema-de-agendamentos.git
```

---

**2. Navegue até a aplicação e rode o comando `nvm use` para usar o versão recomendada do node:**

```bash
cd /sistema-de-agendamentos
nvm use
```

---

**3. Instale as dependências necessárias:**

```bash
npm install --legacy-peer-deps
```

---

**4. Crie os arquivos e variáveis de ambiente para a api e para o cliente:**

```ruby
# .env

POSTGRES_USER="Usuário do seu banco de dados"
POSTGRES_PASSWORD="Senha do seu banco de dados"
POSTGRES_DB="Nome do seu banco de dados"
```

```ruby
# apps/api/.env

DATABASE_URL="URL para conexão com seu banco de dados"
CORS_ORIGIN="Endereço do seu frontend"
PORT="Porta do exposição do seu servidor"
JWT_SECRET="Chave secreta e para encriptar o token. DEVE SER A MESMA CHAVE DO PROJETO WEB"
ADMIN_EMAIL="Email para criar usuário ADMIN pelo script de seed"
ADMIN_PASSWORD="Senha para criar usuário ADMIN pelo script de seed"
```

```ruby
# apps/web/.env

JWT_SECRET="Chave secreta e para encriptar o token. DEVE SER A MESMA CHAVE DO PROJETO API"
NEXT_PUBLIC_API_URL="O endereço do seu servidor para realizar requisições"
```

---

**5. Navegue até o diretório da api `apps/api` e gere os tipos das entidades do prisma:**

```
npx prisma generate
```

---

**6. Rode o comando do docker-compose para fazer o build da imagem do banco de dados:**

```
docker-compose -f docker-compose.yml up -d
```

---

**7. No root, inicie a aplicação:**

```
npm run dev
```
