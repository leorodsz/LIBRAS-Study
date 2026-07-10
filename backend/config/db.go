package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

// essa função inicia conexão com BD
func ConnectDB() *sql.DB {

	// le arquivo .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("erro ao ler arquivo .env: ", err)
	}

	// Atribuindo valores das env vars
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	// monta string de conexao com o banco
	connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUser, dbPassword, dbHost, dbPort, dbName)

	// abre conexao com o banco
	dbConnection, err := sql.Open("mysql", connectionString)

	if err != nil {
		log.Fatal("Erro no Banco: ", err)
	}

	err = dbConnection.Ping()

	if err != nil {
		log.Fatal("Erro no Banco: ", err)
	}

	fmt.Println("Success connect")

	return dbConnection

}
