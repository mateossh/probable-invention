import { appendMessage } from './log';
import { openFiles, sortTabs } from './actions';

const hostName = 'com.mateossh.probable_invention';
let connection: chrome.runtime.Port | null = null;


interface Message {
  query: string
  payload?: string
  response?: string
  isError: boolean
}

// function sendMessage() {
//   const query = document.getElementById('query-input') as HTMLInputElement | null;
//   const payload = document.getElementById('payload-input') as HTMLInputElement | null;
//
//   const message = {
//     query: query?.value.trim(),
//     payload: payload?.value.trim(),
//   }
//   connection!.postMessage(message); // TODO: fix `!`
//   appendMessage(`Sent message: <pre>${JSON.stringify(message, null, 2)}</pre>`);
// }

function onMessage(message: Message) {
  if (message.isError) {
    appendMessage(`Error: ${message.response}`)
    return;
  }

  if (message.query === 'openFiles') {
    openFiles(JSON.parse(message.response!));
  }

  appendMessage(`Received message: <pre>${JSON.stringify(message, null, 2)}</pre>`);
}

function onDisconnected() {
  if (chrome.runtime.lastError) {
    appendMessage(`Failed to connect: ${chrome.runtime.lastError.message}`);
  }
  connection = null;

  document.getElementById('open-files-button')!
          .toggleAttribute('disabled');

  document.getElementById('path-input')!
          .toggleAttribute('disabled');
}

function connect() {
  connection = chrome.runtime.connectNative(hostName);
  connection.onMessage.addListener(onMessage);
  connection.onDisconnect.addListener(onDisconnected);
  appendMessage(`Connected to: ${hostName}`);

  if (connection !== null) {
    document.getElementById('open-files-button')!
            .toggleAttribute('disabled');

    document.getElementById('path-input')!
            .toggleAttribute('disabled');
  }
}

function handleOpenFiles() {
  const path = document.getElementById('path-input') as HTMLInputElement | null;

  connection!.postMessage({
    query: 'openFiles',
    payload: path?.value.trim(),
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button')!
          .addEventListener('click', connect);

  // document.getElementById('send-message-button')!
  //         .addEventListener('click', sendMessage);

  document.getElementById('sort-tabs-button')!
          .addEventListener('click', sortTabs);

  document.getElementById('open-files-button')!
          .addEventListener('click', handleOpenFiles)

});
