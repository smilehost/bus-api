package model

type Item struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Price string `json:"price"`
	Stock string `json:"stock"`
}