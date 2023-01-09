package config

import (
	"os"

	log "github.com/sirupsen/logrus"
	"github.com/joho/godotenv"
)

type Config struct {
	GCPProject string
	GCPBucket  string

	LineSecret string
	LineToken  string
}

var config *Config

func Load() *Config {

	// ローカル開発用。
	//cloud runでは、新しいリビジョンの編集とデプロイ＞「コンテナ＞環境変数に.envの内容を, セキュリティにサービスアカウントを設定」
	//適宜各自で設定する事でアクセス権限エラーを避ける。
	err := godotenv.Load("dev.env")
	if err == nil {
		log.Infoln("Load dev.env file for local dev")
	}

	if config == nil {
		if os.Getenv("GCP_PROJECT") == "" {//other env value might not set as well
			log.Fatalln("GCP_PROJECT is not set:")
		}

		config = &Config{
			GCPProject: os.Getenv("GCP_PROJECT"),
			GCPBucket:  os.Getenv("GCP_BUCKET"),

			LineSecret: os.Getenv("LINE_SECRET"),
			LineToken:  os.Getenv("LINE_TOKEN"),
		}
	}
	return config
}
