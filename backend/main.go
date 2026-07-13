package main

import (
	"fmt"
	"libras_study/config"
	"libras_study/routes"
	"net/http"
)

func main() {

	db := config.ConnectDB()
	defer db.Close()

	routes.SetupRoutes()

	fmt.Println("Servidor rodando: http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
