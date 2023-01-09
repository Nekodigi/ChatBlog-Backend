package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type (
	Api struct {
	}
)

func (Api *Api) Handle(r *gin.RouterGroup) {
	r.GET("/status", func(c *gin.Context) {
		c.String(http.StatusOK, "alive")
	})
}
