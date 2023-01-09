package main

import (
	"github.com/Nekodigi/ChatBlog-Backend/handler"
	"github.com/gin-gonic/gin"
	joonix "github.com/joonix/log"
	log "github.com/sirupsen/logrus"
)

func main() {
	log.SetFormatter(joonix.NewFormatter())
	log.SetLevel(log.DebugLevel)
	log.Infof("setup:start chat-blog-backend")

	engine := gin.Default()

	handler.Router(engine)

	log.Infof("setup:routing chat-blog-backend")
	if err := engine.Run(":8080"); err != nil {
		log.Errorf("gin Run: %+v", err)
	}
	log.Infof("setup:fin  chat-blog-backend")
}
