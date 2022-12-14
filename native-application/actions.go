package main

import (
	"probable-invention/utils"
)

func OpenFiles(iMsg IncomingMessage) OutgoingMessage {
	path := iMsg.Payload

	files := utils.GetFiles(path)
	if len(files) == 0 {
		return OutgoingMessage{
			Query:    "openFiles",
			IsError:  true,
			Response: "invalid path",
		}
	}

	response := string("[")

	for index, file := range files {
		if index < len(files)-1 {
			response = response + "\"" + file + "\", "
		} else {
			response = response + "\"" + file + "\" "
		}
	}
	response = response + "]"

	return OutgoingMessage{
		Query:    "openFiles",
		Response: response,
	}
}
