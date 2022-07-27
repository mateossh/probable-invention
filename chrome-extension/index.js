const hostName = 'probable_invention';
let connection = null;

function appendMessage(text) {
  document.getElementById('response').innerHTML += `<p>${text}</p>`;
}

function sendMessage() {
  message = {'query': document.getElementById('input-text').value.trim()};
  connection.postMessage(message);
  appendMessage(`Sent message: <pre>${JSON.stringify(message, null, 2)}</pre>`);
}

function onMessage(message) {
  appendMessage(`Received message: <pre>${JSON.stringify(message, null, 2)}</pre>`);
}

function onDisconnected() {
  appendMessage(`Failed to connect: ${chrome.runtime.lastError.message}`);
  connection = null;
}

function connect() {
  connection = chrome.runtime.connectNative(hostName);
  connection.onMessage.addListener(onMessage);
  connection.onDisconnect.addListener(onDisconnected);
  appendMessage(`Connected to: ${hostName}`);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener('click', connect);
  document.getElementById('send-message-button').addEventListener('click', sendMessage);
});
