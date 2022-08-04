const hostName = 'probable_invention';
let connection = null;

function appendMessage(text) {
  document.getElementById('response').innerHTML += `<p>${text}</p>`;
}

function sendMessage() {
  const query = document.getElementById('query-input').value.trim();
  const payload = document.getElementById('payload-input').value.trim();

  message = {
    query,
    payload,
  }
  connection.postMessage(message);
  appendMessage(`Sent message: <pre>${JSON.stringify(message, null, 2)}</pre>`);
}

function onMessage(message) {
  appendMessage(`Received message: <pre>${JSON.stringify(message, null, 2)}</pre>`);

  if (message.query === 'openTab') {
    alert('woohooo openTab !!!!!');
  }
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
