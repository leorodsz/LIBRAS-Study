package services // Toda regra de negócio da aplicação deve ser implementada aqui
import (
	"fmt"
	"libras_study/config"
	"libras_study/models"
	"net/mail" // lib para validação de e-mail
)

// Função que valida o email do usuario com net/mail
func ValidateEmail(user *models.User) error {
	_, err := mail.ParseAddress(user.Email)
	if err != nil {
		return err
	}
	return nil
}

func EmailAlreadyExists(email string) (bool, error) {
	db := config.ConnectDB()
	defer db.Close()

	query := "SELECT COUNT(*) FROM users WHERE email = ?"
	var count int
	err := db.QueryRow(query, email).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("Erro ao verificar duplicidade de email: %v", err)
	}
	return count > 0, nil
}

func ValidateRequiredFields(user *models.User) error {
	if user.Nome == "" || user.Email == "" || user.Password == "" {
		return fmt.Errorf("Todos os campos são obrigatórios")
	}
	return nil
}

func ValidatePassword(password string) error {
	if len(password) < 8 {
		return fmt.Errorf("Sua senha deve conter ao menos 8 caracteres")
	}
	for _, char := range password {
		if char == '@' || char == '#' || char == '$' || char == '%' || char == '&' || char == '*' {
			return nil
		}
	}
	return fmt.Errorf("Sua senha deve conter ao menos um caractere especial")
}

func ValidateUpdateUser(user *models.User) error {
	if user.Id == "" || user.Nome == "" || user.Email == "" || user.Password == "" {
		return fmt.Errorf("ID, nome, email e senha são obrigatórios")
	}
	return nil
}

// Função que ja agrupa tudo para deixar o controller mais limpo
func ValidateCreateUser(user *models.User) error {
	if err := ValidateEmail(user); err != nil {
		return err
	}
	if err := ValidateRequiredFields(user); err != nil {
		return err
	}
	if err := ValidatePassword(user.Password); err != nil {
		return err
	}
	return nil
}
