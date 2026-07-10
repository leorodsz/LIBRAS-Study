# LIBRASstudy

## Visão Geral
LIBRASstudy é um projeto web que combina uma aplicação frontend em React com um backend em Go para suportar aprendizado interativo de LIBRAS (Língua Brasileira de Sinais). O frontend inclui reconhecimento de gestos usando TensorFlow, webcam e a biblioteca Fingerpose. O backend possui conectividade com banco de dados MySQL e rotas básicas para manipulação de usuários.

## Estrutura do Projeto

- `package.json` - dependências e scripts do frontend React.
- `backend/` - código do servidor em Go.
  - `main.go` - ponto de entrada do servidor.
  - `config/db.go` - conexão com MySQL via variáveis de ambiente.
  - `controllers/` - controladores do backend (ainda em desenvolvimento).
  - `models/` - modelos de dados do backend.
  - `go.mod` - definição do módulo Go e dependências.
- `src/` - aplicação React.
  - `App.js` - componente principal, carrega modelo de reconhecimento de gestos e exibe webcam.
  - `utilitarios.js` - função de desenho dos pontos e linhas da mão no canvas.
  - arquivos de gesto (`LetraAgesto.js`, `LetraCgesto.js`, etc.) - descrições de gestos para Fingerpose.
  - `index.js`, `App.css`, `index.css` - bootstrap do React e estilos.
- `index/` - página estática principal do site.
  - `index.html`, `menu.js`, `style.css`
- `View/` - páginas de interface estática para login e acesso.
  - `libras.html`, `login.html`, `style.css`
- `Js/` - scripts de interface tradicionais.
  - `cadastro.js` - lógica de login e cadastro via fetch.
- `img/` - imagens usadas no site.

## Funcionalidades Principais

### Frontend React
- Carrega modelo `@tensorflow-models/handpose`.
- Usa `fingerpose` para estimar gestos.
- Detecta e desenha a mão no canvas em tempo real.
- Busca usuário por email e exibe mensagem de boas-vindas.
- Suporta vários gestos personalizados, incluindo sinais de LIBRAS.

### Backend Go
- Conexão com MySQL usando `github.com/go-sql-driver/mysql`.
- Carrega variáveis de ambiente via `github.com/joho/godotenv`.
- Rota raiz (`/`) que retorna mensagem simples.
- Rota `/create-user` preparada para criação de usuário.

## Dependências

### Frontend
- `react`, `react-dom`, `react-scripts`
- `@tensorflow-models/handpose`
- `@tensorflow/tfjs`
- `react-webcam`
- `fingerpose`
- bibliotecas de testes de React

### Backend
- `github.com/gorilla/mux` (import indireto)
- `github.com/go-sql-driver/mysql`
- `github.com/joho/godotenv`
- `filippo.io/edwards25519` (dependência indireta)

## Configuração e Execução

### Backend
1. Crie um arquivo `.env` em `backend/` com as variáveis:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
2. Execute no diretório `backend/`:
   ```bash
   go run .
   ```
3. O servidor sobe em `http://localhost:8080`.

### Frontend
1. Instale dependências no diretório raiz:
   ```bash
   npm install
   ```
2. Execute a aplicação React:
   ```bash
   npm start
   ```
3. O site roda em `http://localhost:3000`.

## Notas Importantes

- O backend ainda precisa de implementação real para CRUD de usuários em `backend/controllers/userController.go`.
- Em `Js/cadastro.js`, a URL de cadastro está definida como `API AQUI` e deve ser substituída pela rota real do backend.
- O frontend React faz requisções para `https://localhost:7072/Cadastro/GetUser` e `https://localhost:7072/Cadastro/Login`, então o backend ou outro serviço deve expor essas rotas.
- `backend/models/user.go` está vazio e precisa ser preenchido com a definição de modelo de usuário.

## Possíveis Próximos Passos

- Implementar rotas REST completas no backend para `CreateUser`, `GetUser`, `DeleteUser`.
- Conectar o formulário de cadastro do frontend ao backend real.
- Adicionar validação e tratamento de erros no backend.
- Padronizar uso de HTTPS ou CORS se frontend e backend estiverem em domínios diferentes.
- Documentar o esquema do banco de dados e as tabelas necessárias.
