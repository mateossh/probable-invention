package logger

import (
  "log"
  "os"
)

var (
	// Trace logs general information messages.
	Trace *log.Logger

	// Error logs error messages.
	Error *log.Logger
)

func Init() {
	file, err := os.OpenFile("log.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal(err)
	}

	Trace = log.New(file, "TRACE: ", log.Ldate|log.Ltime|log.Lshortfile)
	Error = log.New(file, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
}
