# Nome do Projeto

Descrição breve do projeto (ex.: "Aplicação web para [descreva o propósito]"). Este README contém instruções para configurar e rodar o projeto localmente.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão recomendada: X.X.X)
- [npm](https://www.npmjs.com/) (geralmente incluído com o Node.js)
- [Prisma CLI](https://www.prisma.io/docs/getting-started) (para gerenciamento do banco de dados)

## Configuração do Ambiente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/usuario/nome-do-repositorio.git
   cd nome-do-repositorio
   ```

2. **Configure os arquivos de ambiente:**
   - No diretório do **frontend**, crie um arquivo `.env.local` com as seguintes variáveis:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:3000
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```
   - No diretório do **backend**, crie um arquivo `.env` com as seguintes variáveis:
     ```env
     JWT_SECRET=sua-chave-secreta-aqui
     DATABASE_URL="file:./dev.db"
     FRONTEND_URL=http://localhost:3000
     ```
   > **Nota:** Substitua `sua-chave-secreta-aqui` por uma chave segura para o JWT. Para gerar uma, você pode usar ferramentas como `openssl rand -base64 32`.

## Instalação e Execução

### Frontend
1. Navegue até o diretório do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   O frontend estará disponível em `http://localhost:3000` (ou na porta configurada).

### Backend
1. Navegue até o diretório do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Execute as migrações do Prisma para configurar o banco de dados:
   ```bash
   npx prisma migrate dev
   ```
4. Inicie o servidor:
   ```bash
   npm start
   ```
   O backend estará disponível em `http://localhost:3000` (ou na porta configurada).

### Populando o Banco de Dados
Para preencher o banco de dados com dados iniciais, execute o script de seed:
```bash
node prisma/seeds.js
```

## Resolução de Problemas

- **Erro de dependências**: Caso enfrente problemas com dependências, tente usar `npm install --force` ou verifique a compatibilidade das versões do Node.js.
- **Erro de conexão com o banco de dados**: Certifique-se de que o `DATABASE_URL` está correto e que o banco de dados está acessível.
- **CORS**: Verifique se o `FRONTEND_URL` no `.env` do backend corresponde à URL do frontend.
