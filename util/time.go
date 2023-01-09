package util

import (
	"time"
)

func NowJst() *time.Time {
	time.Local = time.FixedZone("Local", 9*60*60)
	localJst, _ := time.LoadLocation("Local")

	jst := time.Now().In(localJst)
	return &jst
}
