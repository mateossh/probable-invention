import React from "react";
import browser, { Tabs } from "webextension-polyfill";

import { Hello } from "../components/hello";
import { Scroller } from "../components/scroller";
import css from "./styles.module.css";

import { NativeMessagingContext } from '../nativeMessagingContext';

// // // //

// Scripts to execute in current tab
const scrollToTopPosition = 0;
const scrollToBottomPosition = 9999999;

function scrollWindow(position: number) {
    window.scroll(0, position);
}

/**
 * Executes a string of Javascript on the current tab
 * @param code The string of code to execute on the current tab
 */
function executeScript(position: number): void {
    // Query for the active tab in the current window
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs: Tabs.Tab[]) => {
        // Pulls current tab from browser.tabs.query response
        const currentTab: Tabs.Tab | number = tabs[0];

        // Short circuits function execution is current tab isn't found
        if (!currentTab) {
            return;
        }
        const currentTabId: number = currentTab.id as number;

        // Executes the script in the current tab
        browser.scripting
            .executeScript({
                target: {
                    tabId: currentTabId,
                },
                func: scrollWindow,
                args: [position],
            })
            .then(() => {
                console.log("Done Scrolling");
            });
    });
}

// // // //

let connection: chrome.runtime.Port | null;
connection = chrome.runtime.connectNative('probable_invention');

function sendMessage() {
  const message = {
    'query': 'elemele',
  }

  if (connection) connection.postMessage(message);
}

function onMessage(message: string) {
  alert(`MESSAGE: ${message}`);
}

function onDisconnect() {
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
  }
  connection = null;
}

if (connection) {
  connection.onMessage.addListener(onMessage);
  connection.onDisconnect.addListener(onDisconnect);
}

export function Popup() {
    // Sends the `popupMounted` event
    React.useEffect(() => {
        browser.runtime.sendMessage({ popupMounted: true });
    }, []);

    // Renders the component tree
    return (
      <NativeMessagingContext.Provider value={connection}>
        <div className={css.popupContainer}>
            <div className="mx-4 my-4">
                <Hello />
                <button onClick={() => { alert('hihi') }}>heheheHEHEHEH</button>
                <hr />
                <Scroller
                    onClickScrollTop={() => {
                        executeScript(scrollToTopPosition);
                    }}
                    onClickScrollBottom={() => {
                        executeScript(scrollToBottomPosition);
                    }}
                />
            </div>
        </div>
      </NativeMessagingContext.Provider>
    );
}
