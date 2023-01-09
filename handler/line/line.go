package line

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/Nekodigi/ChatBlog-Backend/domain/model"
	"github.com/gin-gonic/gin"
	"github.com/line/line-bot-sdk-go/v7/linebot"
	log "github.com/sirupsen/logrus"
)

type (
	Line struct {
		Client   *linebot.Client
		Database LineDatabase
	}

	LineDatabase interface {
		LoadMember(ID string) (*model.Member, error)
		SaveMember(member *model.Member) error
	}

	PostbackData struct {
		Key   string `json:"key"`
		Value string `json:"value"`
		Ack   bool   `json:"ack"`
	}

	Action func(line *Line, event *linebot.Event, pd *PostbackData, member *model.Member) error
)

func (l *Line) Handle(rg *gin.RouterGroup) {
	rg.POST("/callback", func(c *gin.Context) {
		log.Infof("/callback called")

		if e := l.callback(c.Request); e != nil {
			log.Errorf("line callback: %+v", e)
		}
		c.Status(http.StatusOK)
	})
}

func (l *Line) callback(r *http.Request) error {
	events, err := l.Client.ParseRequest(r)
	if err != nil {
		return fmt.Errorf("line ParseRequest: %w", err)
	}

	//conf := config.Load()

	for _, event := range events {
		var member *model.Member
		var err error

		member, err = l.Database.LoadMember(event.Source.UserID)
		if err != nil {
			//初フォロー
			member = model.NewMember(event.Source.UserID)
			log.Infof("new member: %+v", member)
			if err := l.Database.SaveMember(member); err != nil {
				log.Errorf("SaveMember: %+v", err)
				continue
			}
		} else {
			log.Infof("exsisting member: %+v", member)
		}

		//Receive e.g.button action.
		var pd *PostbackData
		if event.Type == linebot.EventTypePostback {
			pd = NewPostbackData(event.Postback.Data)
		}

		action := l.react(event, pd, member)

		if event.Type == linebot.EventTypeMessage {
			if _, err2 := l.Client.ReplyMessage(
				event.ReplyToken,
				linebot.NewTextMessage("TEST"),
			).Do(); err2 != nil {
				log.Errorf("error reply: %+v", err2)
			}

		}
	}
	return nil
}

func (l *Line) react(event *linebot.Event, pd *PostbackData, member *model.Member) Action {
	switch event.Type{
	case linebot.EventTypeFollow:
		if member.Name == ""{
			return setupMemberNew
		}else{
			return setupMemberComeback
		}
	}
}

func NewPostbackData(src string) *PostbackData {
	pd := &PostbackData{}
	// ignore error, just logging
	e := json.Unmarshal([]byte(src), pd)
	if e != nil {
		log.Errorf("NewPostbackData: %+v", e)
	}
	return pd
}
