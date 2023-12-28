package registry

import (
	"fmt"
	"probable-invention/logger"

	"golang.org/x/sys/windows/registry"
)

func AddManifestToRegistry(manifestPath string) {
	regPath := "Software\\Google\\Chrome\\NativeMessagingHosts\\com.mateossh.probable_invention"

	k, _, err := registry.CreateKey(registry.CURRENT_USER, regPath, registry.ALL_ACCESS)
	if err != nil {
		logger.Error.Print("[registry] error while creating key: ", err)
		fmt.Println("error", err)
	}

	defer k.Close()

	err = k.SetStringValue("", manifestPath)
	if err != nil {
		logger.Error.Print("[registry] error while setting value: ", err)
		fmt.Println("error", err)
	}
}
