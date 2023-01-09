package line

import (
	"github.com/Nekodigi/ChatBlog-Backend/domain/model"
	"github.com/line/line-bot-sdk-go/v7/linebot"
)

func setupMemberNew(line *Line, event *linebot.Event, pd *PostbackData, member *model.Member){
	//名前を聞く
	member.Status = model.StatusNone
}