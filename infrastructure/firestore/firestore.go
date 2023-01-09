package firestore

import (
	"context"
	"fmt"

	firebase "firebase.google.com/go"
)

var (
	fs *Firestore
)

type (
	Firestore struct {
		app *firebase.App
	}
)

func NewFirestore(projectID string) (*Firestore, error) {
	if fs == nil {
		// Use the application default credentials
		conf := &firebase.Config{ProjectID: projectID}

		app, err := firebase.NewApp(context.Background(), conf)
		if err != nil {
			return nil, fmt.Errorf("firebase.NewApp: %w", err)
		}
		fs = &Firestore{
			app: app,
		}
	}
	return fs, nil
}
