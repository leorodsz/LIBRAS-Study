# Análise completa do backend do projeto LIBRAS Study

Este documento explica, de forma simples e objetiva, como o backend está organizado neste momento, qual é a lógica de cada parte e como o código funciona na prática.

---

## 1. O que é o backend neste projeto?

O backend é a parte do sistema responsável por:

- receber requisições do frontend ou de um cliente HTTP;
- validar os dados recebidos;
- conectar com o banco de dados;
- salvar, buscar, editar ou apagar usuários;
- devolver respostas em formato JSON.

Em resumo, ele funciona como uma espécie de “portão de entrada” para o banco de dados.

---

## 2. Estrutura atual do backend

A estrutura atual é esta:

- main.go: ponto inicial da aplicação
- config/db.go: conexão com o banco de dados
- controllers/userController.go: funções que recebem as requisições
- models/user.go: estrutura de dados do usuário
- routes/routes.go: definição das rotas da API
- middlewares/: ainda vazio, mas serve para regras extras no futuro
- repositories/: ainda vazio, mas seria o lugar ideal para organizar consultas SQL
- services/: ainda vazio, para regras de negócio mais complexas

---

## 3. Como a aplicação funciona no geral

O fluxo básico é este:

1. O programa inicia em main.go.
2. Ele chama a função de conexão com o banco.
3. Define as rotas da API.
4. Quando uma requisição chega, o servidor identifica qual rota foi chamada.
5. A função correspondente no controller executa a lógica.
6. O controller usa o banco para fazer a operação desejada.
7. O servidor responde com um status HTTP e um JSON.

---

## 4. Arquivo main.go

Arquivo: main.go

### O que faz?

Este arquivo é o ponto de entrada da aplicação. Ele é o primeiro código executado quando o backend sobe.

### Código principal

```go
func main() {
    db := config.ConnectDB()
    defer db.Close()

    routes.SetupRoutes()

    fmt.Println("Servidor rodando: http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}
```

### Explicação linha por linha

- `db := config.ConnectDB()`
  - chama a função que conecta ao banco de dados.

- `defer db.Close()`
  - garante que a conexão será fechada no fim da execução.

- `routes.SetupRoutes()`
  - registra todas as rotas da API.

- `http.ListenAndServe(":8080", nil)`
  - sobe o servidor na porta 8080.

### Exemplo prático

Quando você roda o backend, ele fica esperando requisições em:

- http://localhost:8080/
- http://localhost:8080/create-user
- http://localhost:8080/get-user
- etc.

---

## 5. Arquivo config/db.go

Arquivo: config/db.go

### O que faz?

Este arquivo é responsável por conectar o backend ao banco de dados MySQL.

### O papel do `.env`

Ele usa variáveis de ambiente salvas em um arquivo `.env`, como:

- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME

Essas variáveis são lidas pela biblioteca `godotenv`.

### Código principal

```go
func ConnectDB() *sql.DB {
    err := godotenv.Load()
    ...

    dbHost := os.Getenv("DB_HOST")
    dbPort := os.Getenv("DB_PORT")
    dbUser := os.Getenv("DB_USER")
    dbPassword := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")

    connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPassword, dbHost, dbPort, dbName)

    dbConnection, err := sql.Open("mysql", connectionString)

    err = dbConnection.Ping()

    return dbConnection
}
```

### Explicação simples

- `godotenv.Load()` carrega as informações do arquivo `.env`.
- `os.Getenv(...)` pega cada valor salvo.
- `fmt.Sprintf(...)` monta a string de conexão do MySQL.
- `sql.Open("mysql", connectionString)` abre a conexão.
- `dbConnection.Ping()` testa se a conexão realmente funciona.

### Exemplo mental

Imagine que o banco seja uma porta de entrada. Esta função é quem abre essa porta e confirma se ela está funcionando.

---

## 6. Arquivo routes/routes.go

Arquivo: routes/routes.go

### O que faz?

Define quais URLs da aplicação existem e para qual função do controller cada uma deve ir.

### Código principal

```go
http.HandleFunc("/create-user", controllers.CreateUser)
http.HandleFunc("/get-user", controllers.GetUser)
http.HandleFunc("/update-user", controllers.UpdateUser)
http.HandleFunc("/delete-user", controllers.DeleteUser)
```

### Explicação simples

Cada rota conecta uma URL a uma função específica:

- `/create-user` -> cria usuário
- `/get-user` -> busca usuário
- `/update-user` -> atualiza usuário
- `/delete-user` -> deleta usuário

### Exemplo prático

Se alguém enviar uma requisição para `/create-user`, o backend sabe que precisa chamar a função `CreateUser`.

---

## 7. Arquivo models/user.go

Arquivo: models/user.go

### O que faz?

Define a estrutura do usuário que será usada pelo backend.

### Código

```go
type User struct {
    Id       string `json:"id"`
    Nome     string `json:"nome"`
    Email    string `json:"email"`
    Password string `json:"password,omitempty"`
}
```

### Explicação simples

Esta estrutura serve como um “modelo” para os dados do usuário.

- `Id`: identificador do usuário
- `Nome`: nome
- `Email`: e-mail
- `Password`: senha

### O que significa `json:"nome"`?

Isso informa que, quando o backend receber ou enviar JSON, o campo `Nome` do Go deve ser mapeado para `nome` no JSON.

Exemplo:

```json
{
  "nome": "Maria",
  "email": "maria@email.com",
  "password": "123456"
}
```

---

## 8. Arquivo controllers/userController.go

Arquivo: controllers/userController.go

Este é o coração do backend nesta etapa. Aqui estão as funções que recebem as requisições e executam a lógica.

---

## 9. Função CreateUser

### O que faz?

Cria um novo usuário no banco de dados.

### Código

```go
func CreateUser(write http.ResponseWriter, request *http.Request) {
    var user models.User

    err := json.NewDecoder(request.Body).Decode(&user)
```

### Passo a passo

#### 1. Cria uma variável do tipo User

```go
var user models.User
```

Isso cria um objeto vazio que vai receber os dados enviados no corpo da requisição.

#### 2. Lê o corpo da requisição em formato JSON

```go
err := json.NewDecoder(request.Body).Decode(&user)
```

Aqui o backend pega o JSON enviado pelo cliente e transforma em uma struct Go.

Exemplo de requisição:

```json
{
  "nome": "Ana",
  "email": "ana@email.com",
  "password": "123456"
}
```

#### 3. Verifica se os campos obrigatórios foram preenchidos

```go
if user.Nome == "" || user.Email == "" || user.Password == "" {
    http.Error(write, "Todos os campos são obrigatórios", http.StatusBadRequest)
    return
}
```

Se algum campo estiver vazio, o backend responde com erro 400.

#### 4. Valida o método HTTP

```go
if request.Method != http.MethodPost {
    http.Error(write, "Método não permitido", http.StatusMethodNotAllowed)
    return
}
```

Isso garante que a rota `/create-user` só funcione com `POST`.

#### 5. Abre a conexão com o banco

```go
var db = config.ConnectDB()
defer db.Close()
```

#### 6. Monta o SQL de inserção

```go
query := `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
`
```

Esse SQL diz:

- insira os dados na tabela `users`;
- os valores vão para as colunas `name`, `email` e `password`.

#### 7. Executa a query

```go
_, err = db.Exec(query, user.Nome, user.Email, user.Password)
```

Aqui o backend envia os dados para o banco.

#### 8. Responde ao cliente

```go
write.WriteHeader(http.StatusCreated)
```

Esse código retorna o status `201 Created`, indicando que o usuário foi criado.

### Resposta final

Em caso de sucesso, o backend responde com:

```json
{
  "message": "Usuário criado com sucesso"
}
```

### Exemplo de requisição com curl

```bash
curl -X POST http://localhost:8080/create-user \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana","email":"ana@email.com","password":"123456"}'
```

---

## 10. Função GetUser

### O que faz?

Busca um usuário no banco usando o e-mail como filtro.

### Código inicial

```go
func GetUser(write http.ResponseWriter, request *http.Request) {
    var user models.User

    email := request.URL.Query().Get("email")
```

### Passo a passo

#### 1. Pega o parâmetro `email` da URL

```go
email := request.URL.Query().Get("email")
```

Isso quer dizer que a busca pode acontecer por algo como:

```txt
http://localhost:8080/get-user?email=ana@email.com
```

#### 2. Valida se o e-mail foi informado

```go
if email == "" {
    http.Error(write, "O campo Email é obrigatório: ", http.StatusBadRequest)
    return
}
```

Se o e-mail não vier, o backend retorna erro 400.

#### 3. Valida o método HTTP

```go
if request.Method != http.MethodGet {
    http.Error(write, "Método não permitido", http.StatusMethodNotAllowed)
    return
}
```

Esse endpoint só aceita `GET`.

#### 4. Monta a query de busca

```go
query := `
    SELECT id, name, email, password
    FROM users
    WHERE email = ?
`
```

Essa query busca o usuário cuja coluna `email` seja igual ao valor informado.

#### 5. Executa a busca

```go
_, err := db.Query(query, user.Email)
```

### Importante: ponto de atenção

Nesta implementação, o código faz a consulta, mas não usa o resultado retornado para montar uma resposta com os dados do usuário. Ou seja, ele confirma que a operação foi tentada, mas ainda não retorna as informações do usuário na resposta.

### Resposta atual

Hoje ele responde com uma mensagem genérica:

```json
{
  "message": "Usuário encontrado com sucesso"
}
```

### Exemplo de requisição

```bash
curl "http://localhost:8080/get-user?email=ana@email.com"
```

---

## 11. Função UpdateUser

### O que faz?

Atualiza os dados de um usuário existente.

### Código inicial

```go
func UpdateUser(write http.ResponseWriter, request *http.Request) {
    var user models.User

    err := json.NewDecoder(request.Body).Decode(&user)
```

### Passo a passo

#### 1. Lê o JSON enviado no corpo da requisição

O corpo deve conter os dados atualizados do usuário.

Exemplo:

```json
{
  "id": "1",
  "nome": "Ana Souza",
  "email": "ana.souza@email.com",
  "password": "novaSenha"
}
```

#### 2. Valida se os campos importantes foram preenchidos

```go
if user.Id == "" || user.Nome == "" || user.Email == "" || user.Password == "" {
    http.Error(write, "ID, nome, email e senha são obrigatórios", http.StatusBadRequest)
    return
}
```

#### 3. Valida o método HTTP

```go
if request.Method != http.MethodPut {
    http.Error(write, "Método não permitido", http.StatusMethodNotAllowed)
    return
}
```

Esse endpoint só aceita `PUT`.

#### 4. Monta o SQL de atualização

```go
query := `
    UPDATE users
    SET name = ?, email = ?, password = ?
    WHERE id = ?
`
```

Essa query altera os dados do usuário cujo `id` seja igual ao informado.

#### 5. Executa a atualização

```go
_, err = db.Exec(query, user.Nome, user.Email, user.Password, user.Id)
```

### Exemplo de requisição

```bash
curl -X PUT http://localhost:8080/update-user \
  -H "Content-Type: application/json" \
  -d '{"id":"1","nome":"Ana Souza","email":"ana.souza@email.com","password":"novaSenha"}'
```

---

## 12. Função DeleteUser

### O que faz?

Remove um usuário do banco a partir do ID.

### Código inicial

```go
func DeleteUser(write http.ResponseWriter, request *http.Request) {
    var user models.User

    id := request.URL.Query().Get("id")
```

### Passo a passo

#### 1. Pega o ID da URL

```go
id := request.URL.Query().Get("id")
```

Exemplo:

```txt
http://localhost:8080/delete-user?id=1
```

#### 2. Valida se o ID foi informado

```go
if id == "" {
    http.Error(write, "O campo ID é obrigatório", http.StatusBadRequest)
    return
}
```

#### 3. Valida o método HTTP

```go
if request.Method != http.MethodDelete {
    http.Error(write, "Método não permitido", http.StatusMethodNotAllowed)
    return
}
```

#### 4. Executa o SQL de exclusão

```go
query := `
    DELETE FROM users
    WHERE id = ?
`
```

Essa query remove o usuário de acordo com o ID fornecido.

### Exemplo de requisição

```bash
curl -X DELETE "http://localhost:8080/delete-user?id=1"
```

---

## 13. O que cada código importante significa

### `http.ResponseWriter`

É a resposta que o servidor vai devolver ao cliente.

### `*http.Request`

É a requisição recebida pelo servidor.

### `json.NewDecoder(request.Body).Decode(&user)`

Lê o corpo da requisição JSON e transforma em uma struct Go.

### `http.Error(...)`

Envia uma resposta de erro com status HTTP.

### `write.WriteHeader(...)`

Define o status HTTP da resposta.

### `json.NewEncoder(write).Encode(...)`

Envia uma resposta em JSON para o cliente.

---

## 14. O que o backend faz hoje de forma simples

Hoje o backend já consegue:

- iniciar servidor;
- conectar com MySQL;
- criar usuário;
- buscar usuário;
- atualizar usuário;
- deletar usuário;
- responder em JSON.

---

## 15. Pontos que ainda podem melhorar

Este backend está bem inicial, então ainda há alguns pontos que podem ser melhorados.

### 1. `GetUser` ainda não retorna os dados do usuário

Hoje ele executa a query, mas não usa o resultado para devolver os dados ao cliente.

### 2. O ID está como string

No modelo, `Id` é `string`. Em uma aplicação real, normalmente seria `int` ou `uint`.

### 3. Falta organização maior

As pastas `repositories` e `services` ainda estão vazias. Isso significa que o código ainda está bem direto, mas pode ficar mais organizado no futuro.

### 4. Falta autenticação

Não existe login nem proteção de rotas ainda.

### 5. Falta validação mais robusta

Hoje só é verificado se o campo está vazio. Poderia haver validação de e-mail, senha forte, etc.

---

## 16. Resumo bem simples

Se eu resumisse o projeto em uma frase, seria:

“O backend recebe dados de entrada, conecta no banco MySQL e executa operações de cadastro, leitura, atualização e exclusão de usuários.”

### Em ordem de leitura, o fluxo é:

1. main.go sobe o servidor.
2. config/db.go conecta ao banco.
3. routes/routes.go define as rotas.
4. controllers recebem as requisições.
5. models definem a estrutura dos dados.
6. SQL é executado no banco.
7. O backend responde ao cliente.

---

## 17. Conclusão

Neste momento, o backend é uma API bem simples, mas já mostra a lógica principal de um sistema backend:

- receber requisição;
- tratar dados;
- conversar com o banco;
- devolver resposta.

Isso é o básico de quase toda aplicação web que trabalha com cadastro de usuários.

Se você estudar este arquivo passo a passo, vai entender a lógica central do backend atual do projeto.
