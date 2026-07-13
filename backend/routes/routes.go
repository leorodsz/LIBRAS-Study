package routes

import (
	"fmt"
	"libras_study/controllers"
	"net/http"
)

func SetupRoutes() {
	http.HandleFunc("/", func(write http.ResponseWriter, request *http.Request) {
		fmt.Fprintf(write, "Bem-vindo ao servidor LibrasStudy!")
	})

	http.HandleFunc("/create-user", controllers.CreateUser)
	http.HandleFunc("/get-user", controllers.GetUser)
	http.HandleFunc("/update-user", controllers.UpdateUser)
	http.HandleFunc("/delete-user", controllers.DeleteUser)
}
