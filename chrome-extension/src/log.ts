export function appendMessage(text: string) {
  document.getElementById('response')!.innerHTML += `<p>${text}</p>`;
}
