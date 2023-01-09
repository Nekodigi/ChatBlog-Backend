package handler

import (
	"github.com/Nekodigi/ChatBlog-Backend/config"
	"github.com/Nekodigi/ChatBlog-Backend/handler/api"
	"github.com/Nekodigi/ChatBlog-Backend/handler/line"
	infraFirestore "github.com/Nekodigi/ChatBlog-Backend/infrastructure/firestore"
	"github.com/gin-gonic/gin"
	"github.com/line/line-bot-sdk-go/v7/linebot"

	log "github.com/sirupsen/logrus"
)

var (
	lineClient *linebot.Client
	firestore  *infraFirestore.Firestore
)

func init() {
	var err error
	conf := config.Load()

	lineClient, err = linebot.New(conf.LineSecret, conf.LineToken)
	if err != nil {
		log.Fatalf("linebot.New: %+v", err)
	}

	firestore, err = infraFirestore.NewFirestore(conf.GCPProject)
	if err != nil {
		log.Fatalf("infra.NewFirestore: %+v", err)
	}

}

func Router(e *gin.Engine) {
	(&line.Line{Client: lineClient, Database: firestore}).Handle(e.Group("/line"))
	(&api.Api{}).Handle(e.Group("/api"))
}
