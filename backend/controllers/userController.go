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

	var db = config.ConnectDB()
	defer db.Close()

}

func GetUser(write http.ResponseWriter, request *http.Request) {
	var user models.User

	email := request.URL.Query().Get("email")

	if email == "" {
		http.Error(write, "O campo Email é obrigatório: ", http.StatusBadRequest)
		return
	}

	user.Email = email

	var db = config.ConnectDB()
	defer db.Close()
}

func DeleteUser(write http.ResponseWriter, request *http.Request) {
	var user models.User

	id := request.URL.Query().Get("id")

	if id == "" {
		http.Error(write, "O campo ID é obrigatório", http.StatusBadRequest)
		return
	}

	user.Id = id

	var db = config.ConnectDB()
	defer db.Close()
}
