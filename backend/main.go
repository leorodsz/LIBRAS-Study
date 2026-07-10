package main

import (
	"fmt"
	"libras_study/config"
	"net/http"
)

func main() {

	db := config.ConnectDB()
	defer db.Close()

	if db != nil {
		http.HandleFunc("/", func(write http.ResponseWriter, request *http.Request) {
			fmt.Fprintf(write, "Bem-vindo ao servidor LibrasStudy!")
		})
		http.HandleFunc("/create-user", func(write http.ResponseWriter, request *http.Request) {
			fmt.Fprintf(write, "Rota de criação de usuário")
		})
	}

	fmt.Println("Servidor rodando: http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
