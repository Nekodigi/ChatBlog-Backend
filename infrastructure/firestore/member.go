package firestore

import (
	"context"
	"fmt"

	"github.com/Nekodigi/ChatBlog-Backend/domain/model"
	log "github.com/sirupsen/logrus"
)

func (fs *Firestore) SaveMember(member *model.Member) error {
	ctx := context.Background()
	fc, err := fs.app.Firestore(ctx)
	if err != nil {
		return fmt.Errorf("fs.app.Firestore: %w", err)
	}
	defer fc.Close()

	batch := fc.Batch()

	clientRef := fc.Collection("members").Doc(member.ID)
	batch.Set(clientRef, member)

	ws, err := batch.Commit(ctx)
	if err != nil {
		return fmt.Errorf("batch.Commit: %w", err)
	}

	for idx, w := range ws {
		log.Infof("client batch result[%d] updatedAt: %s", idx, w.UpdateTime)
	}
	return nil
}

func (fs *Firestore) LoadMember(ID string) (*model.Member, error) {
	ctx := context.Background()
	fc, err := fs.app.Firestore(ctx)
	if err != nil {
		return nil, fmt.Errorf("fs.app.Firestore: %w", err)
	}
	defer fc.Close()

	//member
	cSnap, err := fc.Collection("members").Doc(ID).Get(ctx)
	if err != nil {
		return nil, fmt.Errorf("fc.Collection.members: %w", err)
	}
	member := &model.Member{}
	if err := cSnap.DataTo(member); err != nil {
		return nil, fmt.Errorf("cSnap.DataTo: %w", err)
	}

	return member, nil
}
