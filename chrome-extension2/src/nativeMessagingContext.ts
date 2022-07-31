import { createContext } from 'react';





// const hostName = 'probable_invention';
let connection: chrome.runtime.Port | null = null;

// connection = chrome.runtime.connectNative(hostName);


export const NativeMessagingContext = createContext(connection as chrome.runtime.Port | null);

function appendMessage(text: string) {
  document.getElementById('response')!.innerHTML += `<p>${text}</p>`;
}

function sendMessage() {
  const elem = document.getElementById('input-text') as HTMLInputElement;
  const query = elem.value.trim() as string;
  const message = { query };

  if (connection) connection.postMessage(message);
  appendMessage(`Sent message: <pre>${JSON.stringify(message, null, 2)}</pre>`);
}

function onMessage(message: string) {
  appendMessage(`Received message: <pre>${JSON.stringify(message, null, 2)}</pre>`);
}

function onDisconnected() {
  if (chrome.runtime.lastError) {
    appendMessage(`Failed to connect: ${chrome.runtime.lastError.message}`);
  }
  connection = null;
}

function connect() {
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button')!.addEventListener('click', connect);
  document.getElementById('send-message-button')!.addEventListener('click', sendMessage);
});

