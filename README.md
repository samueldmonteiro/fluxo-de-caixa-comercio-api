# 📦 Fluxo de Caixa Comércio API

Esta é uma API moderna e modular para gestão de movimentações financeiras, e visualização de métricas para análises comerciais.  
Construída sobre uma stack sólida — **Node.js + Express + Prisma + TypeScript** — ela entrega performance, organização e extensibilidade. Tudo isso documentado com **Swagger**, porque projeto bom não deve ser um mistério.

---

## 🚀 Tecnologias Principais

- **Node.js**
- **TypeScript**
- **Express**
- **Prisma ORM**
- **MySQL**
- **Swagger (OpenAPI)**
- **JWT Authentication**
- **TSyringe (DI)**

---

## 📂 Estrutura do Projeto (visão geral)

```
src/
 ├─ controllers/
 ├─ middlewares/
 ├─ schemas/
 ├─ errors/
 ├─ types/
 ├─ config/
 ├─ mappers/
 ├─ services/
 ├─ repositories/
 ├─ generated/prisma/
 ├─ routes/
 ├─ app.ts
 └─ server.ts
prisma/
 ├─ seed.ts
 └─ schema.prisma
```

---

## 🧩 Modelos principais (Prisma)

### 👤 User
- id, name, email, password  
- role (`USER` | `ADMIN`)  
- relacionamentos: Movements e Categories

### 🏷️ Category
- id, name, userId  
- cada categoria pode ter vários movimentos associados

### 💸 Movement
- id, useId, categoryId, description, type (`INCOME` | `EXPENSE`), value, date  
- relacionamento com usuário e categoria

---

## 📊 Funcionalidades

### 🔐 Autenticação
- Login  
- Informações do usuário logado

### 👤 Área do usuário
- Listar movimentações  
- Listar categorias  
- Listar movimentos de uma categoria  
- Buscar movimento ou categoria específica  
- Métricas filtradas por data

### 💸 Movimentos
- Criar, atualizar, deletar

### 🏷️ Categorias
- Criar, atualizar, deletar

---

## 📘 Documentação da API

Após iniciar a aplicação, acesse:

```
http://localhost:3000/docs
```

---

## 🛠️ Como rodar o projeto

### 1. 📥 Clonar o repositório

```bash
git clone https://github.com/seu-usuario/fluxo-de-comercio-api.git
cd fluxo-de-comercio-api
```

### 2. 📦 Instalar dependências

```bash
yarn
```

### 3. ⚙️ Criar o arquivo `.env`

Crie o arquivo na raiz:

```env
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=fluxo_caixa
DB_PORT=3306
JWT_SECRET=sua_key_JWT

# for cli
DATABASE_URL=mysql://root:sua_senha@localhost:3306/fluxo_caixa
```
### 4. ⚙️ Subir Banco de dados Docker

```bash
docker compose up -d
```

### AMBIENTE (DEV)
#### 5. 🏗️ Gerar o client Prisma e rodar migrations

```bash
yarn prisma:generate
yarn prisma:migrate
```

#### 6. ▶️ RODAR SEEDS

Popular banco de dados:

```bash
yarn seed
```

#### 7. ▶️ Iniciar o servidor

Modo desenvolvimento:

```bash
yarn dev
```

### AMBIENTE (PROD)

#### 5. 🏗️ Gerar o client Prisma e rodar migrations

```bash
yarn prisma:generate
yarn prisma:deploy

```

#### 6. ▶️ Iniciar o servidor

Modo desenvolvimento:

```bash
yarn build
yarn start
```

---

## 🧪 Teste rápido

**Ping da API:**

```
GET http://localhost:3000/api/ping
```

Resposta esperada:

```json
{ "pong": true }
```

---

## 🤝 Contribuições

Pull requests são bem-vindos.  

---


---

## ✨ Autor

Desenvolvido por **Samuel Davi**
