import { appendMessage } from './log'

export function openFiles(files: unknown[]) {
  for (let file of files) {
    chrome.tabs.create({
      url: `file://${file}`
    });
  }
}

export async function sortTabs() {
  // https://github.com/GoogleChrome/chrome-extensions-samples/tree/main/tutorials/tabs-manager

  const tabs = await chrome.tabs.query({ currentWindow: true });

  for (let tab of tabs) {
    if (tab.url!.startsWith('file://')) {
      const filename = decodeURI(
        tab.url!.replace('file://', '').split('/').slice(-1)[0]
      );

      const tabNewPos: number = parseInt(filename.split(' ')[0]) - 1;
      chrome.tabs.move(tab.id!, { index: tabNewPos });
    }
  }

  appendMessage(`LOG: <pre>${JSON.stringify(tabs, null, 2)}</pre>`)
}
