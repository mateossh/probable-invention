package utils

import (
	"io/ioutil"
	"path/filepath"
	"strings"
)

func GetFiles(p string) []string {
	result := make([]string, 0)

	files, err := ioutil.ReadDir(p)
	if err != nil {
		return result
	}

	for _, file := range files {
		if !file.IsDir() {
			fileAbsolutePath := filepath.Join(p, file.Name())

			// handling Windows paths
			if string(fileAbsolutePath[1]) == ":" {
				fileAbsolutePath = strings.ReplaceAll(fileAbsolutePath, "\\", "\\\\")
			}

			result = append(result, fileAbsolutePath)
		}
	}
	return result
}
