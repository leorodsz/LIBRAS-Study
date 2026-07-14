package controllers

import (
	"encoding/json"
	"libras_study/config"
	"libras_study/models"
	"net/http"
)

func CreateUser(write http.ResponseWriter, request *http.Request) {
	var user models.User

	err := json.NewDecoder(request.Body).Decode(&user)

	if err != nil {
		http.Error(write, "Erro ao decodificar JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	if user.Nome == "" || user.Email == "" || user.Password == "" {
		http.Error(write, "Todos os campos são obrigatórios", http.StatusBadRequest)
		return
	}

	if request.Method != http.MethodPost {
		http.Error(write, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var db = config.ConnectDB()
	defer db.Close()

	query := `
		INSERT INTO users (nome, email, senha)
		VALUES (?, ?, ?)
		`
	_, err = db.Exec(
		query,
		user.Nome,
		user.Email,
		user.Password,
	)

	if err != nil {
		http.Error(write, "Erro ao criar usuário: "+err.Error(), http.StatusInternalServerError)
		return
	}
	write.WriteHeader(http.StatusCreated)

	json.NewEncoder(write).Encode(map[string]string{
		"message": "Usuário criado com sucesso",
	})
}

func GetUser(write http.ResponseWriter, request *http.Request) {
	var user models.User

	email := request.URL.Query().Get("email")

	if email == "" {
		http.Error(write, "O campo Email é obrigatório: ", http.StatusBadRequest)
		return
	}

	if request.Method != http.MethodGet {
		http.Error(write, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	user.Email = email

	var db = config.ConnectDB()
	defer db.Close()

	query := `
		SELECT id, nome, email, senha
		FROM users
		WHERE email = ?
	`
	_, err := db.Query(query, user.Email)
	if err != nil {
		http.Error(write, "Erro ao buscar usuário: "+err.Error(), http.StatusInternalServerError)
		return
	}

	write.WriteHeader(http.StatusAccepted)

	json.NewEncoder(write).Encode(map[string]string{
		"message": "Usuário encontrado com sucesso",
	})
}

func UpdateUser(write http.ResponseWriter, request *http.Request) {
	var user models.User

	err := json.NewDecoder(request.Body).Decode(&user)
	if err != nil {
		http.Error(write, "Erro ao decodificar JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	if user.Id == "" || user.Nome == "" || user.Email == "" || user.Password == "" {
		http.Error(write, "ID, nome, email e senha são obrigatórios", http.StatusBadRequest)
		return
	}

	if request.Method != http.MethodPut {
		http.Error(write, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var db = config.ConnectDB()
	defer db.Close()

	query := `
	UPDATE users
	SET nome = ?, email = ?, senha = ?
	WHERE id = ?
	`
	_, err = db.Exec(
		query,
		user.Nome,
		user.Email,
		user.Password,
		user.Id,
	)

	if err != nil {
		http.Error(write, "Erro ao atualizar usuário: "+err.Error(), http.StatusInternalServerError)
		return
	}

	write.WriteHeader(http.StatusOK)

	json.NewEncoder(write).Encode(map[string]string{
		"message": "Usuário atualizado com sucesso",
	})
}

func DeleteUser(write http.ResponseWriter, request *http.Request) {
	var user models.User

	id := request.URL.Query().Get("id")

	if id == "" {
		http.Error(write, "O campo ID é obrigatório", http.StatusBadRequest)
		return
	}

	if request.Method != http.MethodDelete {
		http.Error(write, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	user.Id = id

	var db = config.ConnectDB()
	defer db.Close()

	query := `
		DELETE FROM users
		WHERE id = ?
	`
	_, err := db.Exec(query, user.Id)
	if err != nil {
		http.Error(write, "Erro ao excluir usuário: "+err.Error(), http.StatusInternalServerError)
		return
	}
	write.WriteHeader(http.StatusOK)

	json.NewEncoder(write).Encode(map[string]string{
		"message": "Usuário excluído com sucesso",
	})
}
