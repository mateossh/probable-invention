package logger

import (
  "log"
  "io"
  "os"
)

var (
	// Trace logs general information messages.
	Trace *log.Logger

	// Error logs error messages.
	Error *log.Logger
)

func Init() {
  var traceHandle io.Writer
  var errorHandle io.Writer

	file, err := os.OpenFile("log.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)

  if err != nil {
    traceHandle = os.Stdout
    errorHandle = os.Stderr

    Error.Printf("Unable to create and/or open log file. Will log to Stdout and Stderr. Error: %v", err)
  } else {
    traceHandle = file
    errorHandle = file

    defer file.Close()
  }


	Trace = log.New(traceHandle, "TRACE: ", log.Ldate|log.Ltime|log.Lshortfile)
	Error = log.New(errorHandle, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)
}
