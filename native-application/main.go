package main

import (
	"bufio"
	"bytes"
	"encoding/binary"
	"encoding/json"
	"io"
	"os"

	"unsafe"
  // "fmt"
  
  "probable-invention/logger"
  "probable-invention/utils"
)


// nativeEndian used to detect native byte order
var nativeEndian binary.ByteOrder

// bufferSize used to set size of IO buffer - adjust to accommodate message payloads
var bufferSize = 8192

// IncomingMessage represents a message sent to the native host.
type IncomingMessage struct {
	Query string `json:"query"`
	Payload string `json:"payload,omitempty"`
}

// OutgoingMessage respresents a response to an incoming message query.
type OutgoingMessage struct {
	Query    string `json:"query"`
	Response string `json:"response"`
}


// readMessageLength reads and returns the message length value in native byte order.
func readMessageLength(msg []byte) int {
	var length uint32
	buf := bytes.NewBuffer(msg)
	err := binary.Read(buf, nativeEndian, &length)
	if err != nil {
		logger.Error.Printf("Unable to read bytes representing message length: %v", err)
	}
	return int(length)
}

// parseMessage parses incoming message
func parseMessage(msg []byte) {
	iMsg := decodeMessage(msg)
	logger.Trace.Printf("Message received: %s", msg)

	// start building outgoing json message
	oMsg := OutgoingMessage{
		Query: iMsg.Query,
	}

	switch iMsg.Query {
  case "openFiles":
    path := iMsg.Payload

    files := utils.GetFiles(path)
    response := string("[")

    for index, file := range files {
      if index < len(files) - 1 {
        response = response + "\"" + file + "\", " 
      } else {
        response = response + "\"" + file + "\" " 
      }
    }
    response = response + "]"

    oMsg.Query = "openFiles"
    oMsg.Response = response
  case "something":
    oMsg.Query = "openTab"
    oMsg.Response = "https://mateossh.me"
	case "wooga":
		oMsg.Response = "booga"
	case "ping":
		oMsg.Response = "pong"
	case "hello":
		oMsg.Response = "goodbye"
	default:
		oMsg.Response = "kasjdflkajsdkljfs"
	}

	send(oMsg)
}

// decodeMessage unmarshals incoming json request and returns query value.
func decodeMessage(msg []byte) IncomingMessage {
	var iMsg IncomingMessage
	err := json.Unmarshal(msg, &iMsg)
	if err != nil {
		logger.Error.Printf("Unable to unmarshal json to struct: %v", err)
	}
	return iMsg
}


// writeMessageLength determines length of message and writes it to os.Stdout.
func writeMessageLength(msg []byte) {
	err := binary.Write(os.Stdout, nativeEndian, uint32(len(msg)))
	if err != nil {
		logger.Error.Printf("Unable to write message length to Stdout: %v", err)
	}
}

// read Creates a new buffered I/O reader and reads messages from Stdin.
func read() {
	v := bufio.NewReader(os.Stdin)
	// adjust buffer size to accommodate your json payload size limits; default is 4096
	s := bufio.NewReaderSize(v, bufferSize)
	logger.Trace.Printf("IO buffer reader created with buffer size of %v.", s.Size())

	lengthBytes := make([]byte, 4)
	lengthNum := int(0)

	// we're going to indefinitely read the first 4 bytes in buffer, which gives us the message length.
	// if stdIn is closed we'll exit the loop and shut down host
	for b, err := s.Read(lengthBytes); b > 0 && err == nil; b, err = s.Read(lengthBytes) {
		// convert message length bytes to integer value
		lengthNum = readMessageLength(lengthBytes)
		logger.Trace.Printf("Message size in bytes: %v", lengthNum)

		// If message length exceeds size of buffer, the message will be truncated.
		// This will likely cause an error when we attempt to unmarshal message to JSON.
		if lengthNum > bufferSize {
			logger.Error.Printf("Message size of %d exceeds buffer size of %d. Message will be truncated and is unlikely to unmarshal to JSON.", lengthNum, bufferSize)
		}

		// read the content of the message from buffer
		content := make([]byte, lengthNum)
		_, err := s.Read(content)
		if err != nil && err != io.EOF {
			logger.Error.Fatal(err)
		}

		// message has been read, now parse and process
		parseMessage(content)
	}

	logger.Trace.Print("Stdin closed.")
}

// send sends an OutgoingMessage to os.Stdout.
func send(msg OutgoingMessage) {
	byteMsg, err := json.Marshal(msg)
  if err != nil {
    logger.Error.Printf("Unable to marshal OutgoingMessage struct to []byte: %v", err)
  }
	writeMessageLength(byteMsg)

	var msgBuf bytes.Buffer
	_, err = msgBuf.Write(byteMsg)
	if err != nil {
		logger.Error.Printf("Unable to write message length to message buffer: %v", err)
	}

	_, err = msgBuf.WriteTo(os.Stdout)
	if err != nil {
		logger.Error.Printf("Unable to write message buffer to Stdout: %v", err)
	}
}

func main() {
	// determine native byte order so that we can read message size correctly
	var one int16 = 1
	b := (*byte)(unsafe.Pointer(&one))
	if *b == 0 {
		nativeEndian = binary.BigEndian
	} else {
		nativeEndian = binary.LittleEndian
	}

  logger.Init()

	logger.Trace.Printf("Chrome native messaging host started. Native byte order: %v.", nativeEndian)
	read()
	logger.Trace.Print("Chrome native messaging host exited.")

  // files := utils.GetFiles("/Users/matt/Code/personal/probable-invention")
  // for _, file := range files {
  //   fmt.Println(file)
  // }
}
