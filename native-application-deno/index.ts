interface IncomingMessage {
  query: string,
  payload: string,
}

interface OutgoingMessage {
  query: string,
  response: string,
  isError: boolean,
}

const bufferSize = 8192; // magic found in golang code

// https://stackoverflow.com/a/58033584
// https://stackoverflow.com/a/58033584
// https://deno.land/api@v1.28.1?s=Deno.stdin
async function read() {
  const decoder = new TextDecoder();

  for await (const chunk of Deno.stdin.readable) {
    const text = decoder.decode(chunk.subarray(4));

    log(`Read message: ${text}`);
    parseMessage(text);
  }
}

function mergeArrays(arr1: Uint8Array, arr2: Uint8Array): Uint8Array {
  // https://stackoverflow.com/a/49129872
  const mergedArray = new Uint8Array(arr1.length + arr2.length);

  mergedArray.set(arr1);
  mergedArray.set(arr2, arr1.length);

  return mergedArray;
}

// personally I don't know what's happening here
// https://stackoverflow.com/a/69721696
// @ts-ignore: gugu gaga
function intToArray(i) {
    return Uint8Array.of(
      (i&0xff000000)>>24,
      (i&0x00ff0000)>>16,
      (i&0x0000ff00)>> 8,
      (i&0x000000ff)>> 0);
}

// @ts-ignore: shhh.
function intToArrayGuguGaga(i) {
    return Uint8Array.of(
      (i&0x000000ff)>> 0,
      (i&0x0000ff00)>> 8,
      (i&0x00ff0000)>>16,
      (i&0xff000000)>>24
    );
}

async function write(message: OutgoingMessage) {
  const msg = new TextEncoder().encode(JSON.stringify(message));
  const msgLen = intToArrayGuguGaga(msg.length);

  const something = mergeArrays(msgLen, msg);

  log(`Sent message (Uint8array): ${something}`);
  log(`Sent message (string): { query: "${message.query}", response: "${message.response}", isError: "${message.isError}" }`);

  await Deno.stdout.write(something);
}

function parseMessage(m: string): void {
  let message: IncomingMessage;
  try {
    message = JSON.parse(m);
  } catch(_e) {
    const response: OutgoingMessage = {
      query: 'error',
      response: 'error while parsing JSON',
      isError: true,
    }
    write(response);
    return;
  }

  if (message.query === 'openFiles') {
    const files = getFiles(message.payload);

    const response: OutgoingMessage = {
      query: message.query,
      response: JSON.stringify(files),
      isError: false,
    }

    write(response);
  }

  if (message.query === 'ping') {
    const response: OutgoingMessage = {
      query: message.query,
      response: 'pong',
      isError: false,
    };

    write(response);
  }
}

function getFiles(dir: string): string[] {
  const files: string[] = [];

  for (const dirEntry of Deno.readDirSync(dir)) {
    if (dirEntry.isFile) {
      const absolutePath = `${dir}/${dirEntry.name}`;

      files.push(absolutePath);
    }
  }

  return files;
}

function log(msg: string) {
  const buf = new TextEncoder().encode(`${msg}\n`);

  Deno.writeFileSync('./log.txt', buf, { append: true });
 }

log('\nNative application started');
await read();
