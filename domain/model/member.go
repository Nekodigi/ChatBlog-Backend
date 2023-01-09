package model

import (
	"time"

	"github.com/Nekodigi/ChatBlog-Backend/util"
)

const (
	StatusNone = "none"
)

type (
	Member struct {
		ID string `json:"id" firestore:"id"`

		Name    string `json:"name" firestore:"name"`
		Status  string `json:"status" firestore:"status"`
		IsAdmin bool   `json:"isAdmin" firestore:"isAdmin"`

		CreatedAt *time.Time `json:"createdAt" firestore:"createdAt,omitempty"`
	}
)

func NewMember(ID string) *Member {
	return &Member{
		ID:        ID,
		Name:      "",
		Status:    StatusNone,
		IsAdmin:   false,
		CreatedAt: util.NowJst(),
	}
}
