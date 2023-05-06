package utils

import (
	"io/ioutil"
	"path/filepath"
	"strings"

	"probable-invention/logger"
)

func GetFiles(p string) []string {
	result := make([]string, 0)

	logger.Trace.Printf("Utils/GetFiles begin!")

	files, err := ioutil.ReadDir(p)
	if err != nil {
		logger.Error.Printf("Couldn't read directory. %v", err)
		return result
	}

	for _, file := range files {
		if !file.IsDir() {
			fileAbsolutePath := filepath.Join(p, file.Name())

			// handling Windows paths
			if string(fileAbsolutePath[1]) == ":" {
				fileAbsolutePath = strings.ReplaceAll(fileAbsolutePath, "\\", "\\\\")
			}

			logger.Trace.Printf("Utils/GetFiles filePath= %v", fileAbsolutePath)

			result = append(result, fileAbsolutePath)
		}
	}

	logger.Trace.Printf("Utils/GetFiles end!")
	return result
}
