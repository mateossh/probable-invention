import { writable } from 'svelte/store';

import type { Message } from './types';
import { openFiles } from './utils';

const hostName = 'com.mateossh.probable_invention';
export let connection: chrome.runtime.Port | null = null;
export let isConnected = writable(false);

function onDisconnect() {
  // NOTE: this is fired only when .exe is killed
  if (chrome.runtime.lastError) {
    console.log(`Failed to connect: ${chrome.runtime.lastError.message}`);
  }
  connection = null;
}

function onMessage(message: Message) {
  alert(`onMessage ${message.query}... ${message.response}`);

  if (message.query === 'openFiles') {
    const files = JSON.parse(message.response);
    openFiles(files);
  }
}

export function connect() {
  connection = chrome.runtime.connectNative(hostName);

  if (connection) isConnected.set(true);

  connection.onDisconnect.addListener(onDisconnect);
  connection.onMessage.addListener(onMessage);
}

export function disconnect() {
  isConnected.set(false);

  connection.disconnect();
}
