import { EVENT } from 'src/constants';
import { AnyEvent } from 'src/types';

export function sendMessageToContentScript(type: EVENT, payload?: AnyEvent['payload']) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    for (const tab of tabs) {
      if (!tab.id) return;

      chrome.tabs.sendMessage(tab.id, {
        type,
        payload,
      });
    }
  });
}

export function sendEventToBackground(type: EVENT, payload?: AnyEvent['payload']) {
  chrome.runtime.sendMessage({
    type,
    payload,
  });
}

export function onEvent<T extends AnyEvent>(type: EVENT, handler: (message: T) => void) {
  chrome.runtime.onMessage.addListener((message: AnyEvent) => {
    if (message.type !== type) return;

    handler(message as T);
  })
}
