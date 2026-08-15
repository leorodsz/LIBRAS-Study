package models

type User struct {
	Id       string `json:"id"` // Melhoria futura é estar INT e usar strconv no controller [DELETE_USER]
	Nome     string `json:"nome"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`
}

type UserResponse struct {
	Id       string `json:"id"`
	Nome     string `json:"nome"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`
}
