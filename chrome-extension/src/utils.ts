export function openFiles(files: string[]) {
  for (let file of files) {
    const url = `file://${file}`;

    chrome.tabs.create({ url });
  }
}

export async function sortTabs() {
  const tabs = await chrome.tabs.query({ currentWindow: true });

  for (let tab of tabs) {
    const { id, url } = tab;

    if (url.startsWith('file://')) {
      const filename = decodeURI(
        url.replace('file://', '').split('/').slice(-1)[0]
      );

      const index = parseInt(filename.split(' ')[0]) - 1;
      chrome.tabs.move(id, { index });
    }
  }
}
