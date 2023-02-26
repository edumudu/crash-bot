import { EVENT } from '../../constants';
import { AnyEvent } from '../../types';

export function sendMessageToContentScript<T>(type: EVENT, payload?: AnyEvent['payload']): Promise<T> {
  return new Promise(resolve => {
    chrome.tabs.query({
      active: true,
      url: 'https://blaze.com/*'
    }, async function ([tab]) {
      if(!tab?.id) throw new Error('Tab not found');

      const listenerResult = await chrome.tabs.sendMessage(tab.id, {
        type,
        payload,
      })

      resolve(listenerResult);
    });
  });
}

export function sendEventToBackground(type: EVENT, payload?: AnyEvent['payload']) {
  chrome.runtime.sendMessage({
    type,
    payload,
  });
}

export function onEvent<T extends AnyEvent>(type: EVENT, handler: (message: T) => any) {
  chrome.runtime.onMessage.addListener((message: AnyEvent, _, sendResponse) => {
    if (message.type !== type) return;

    const handlerResult = handler(message as T);

    if (handlerResult && 'then' in handlerResult) handlerResult.then((res: unknown) => sendResponse(res));
    else sendResponse(handlerResult);

    return true;
  })
}
