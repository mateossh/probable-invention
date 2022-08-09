const hostName = 'probable_invention';
let connection: chrome.runtime.Port | null = null;

interface Message {
  query: string
  payload?: string
}

function appendMessage(text: string) {
  document.getElementById('response')!.innerHTML += `<p>${text}</p>`;
}

function sendMessage() {
  const query = document.getElementById('query-input') as HTMLInputElement | null;
  const payload = document.getElementById('payload-input') as HTMLInputElement | null;

  const message = {
    query: query?.value.trim(),
    payload: payload?.value.trim(),
  }
  connection!.postMessage(message); // TODO: fix `!`
  appendMessage(`Sent message: <pre>${JSON.stringify(message, null, 2)}</pre>`);
}

function onMessage(message: Message) {
  appendMessage(`Received message: <pre>${JSON.stringify(message, null, 2)}</pre>`);

  if (message.query === 'openTab') {
    alert('woohooo openTab !!!!!');
  }
}

function onDisconnected() {
  if (chrome.runtime.lastError) {
    appendMessage(`Failed to connect: ${chrome.runtime.lastError.message}`);
  }
  connection = null;
}

function connect() {
  connection = chrome.runtime.connectNative(hostName);
  connection.onMessage.addListener(onMessage);
  connection.onDisconnect.addListener(onDisconnected);
  appendMessage(`Connected to: ${hostName}`);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button')!.addEventListener('click', connect); // TODO: fix `!`
  document.getElementById('send-message-button')!.addEventListener('click', sendMessage); // TODO: fix `!`
});
