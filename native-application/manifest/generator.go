package manifest

import (
	"encoding/json"
	"fmt"
	"os"
	"path"
	"probable-invention/logger"
)

type Manifest struct {
	Name           string   `json:"name"`
	Description    string   `json:"description"`
	Path           string   `json:"path"`
	MyType         string   `json:"type"`
	AllowedOrigins []string `json:"allowed_origins"`
}

func Generate(extensionId string, executablePath string) {
	allowedExtension := "chrome-extension://" + extensionId

	allowed_origins := []string{allowedExtension}

	data := Manifest{
		Name:           "com.mateossh.probable_invention",
		Description:    "chrome native messaging thingie for work",
		Path:           executablePath,
		MyType:         "stdio",
		AllowedOrigins: allowed_origins,
	}

	appdata := os.Getenv("LOCALAPPDATA")
	manifestDirPath := path.Join(appdata, "probable-invention")
	manifestFilePath := path.Join(manifestDirPath, "manifest.json")

	err := os.MkdirAll(manifestDirPath, 0644)
	if err != nil {
		logger.Error.Print("[registry] error while creating dir in appdata: ", err)
		fmt.Println("error", err)
	}

	file, _ := json.MarshalIndent(data, "", " ")
	_ = os.WriteFile(manifestFilePath, file, 0644)
}
