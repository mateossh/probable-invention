package utils

import (
	"io/ioutil"
  "log"
  "path"
)

func GetFiles(p string) []string {
  files, err := ioutil.ReadDir(p)
  if err != nil {
    log.Fatal(err)
  }

  result := make([]string, 0)

  for _, file := range files {
    if !file.IsDir() {
      absolutePath := path.Join(p, file.Name())
      result = append(result, absolutePath)
    }
  }
  return result
}


// files := utils.GetFiles("/Users/matt/Code/personal/probable-invention")
// for _, file := range files {
//   fmt.Println(file)
// }
