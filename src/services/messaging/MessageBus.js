import { MESSAGE_TYPES } from "./messageTypes";

export class MessageBus {
  send(message) {
    return chrome.runtime.sendMessage(message);
  }

  onProgress(listener) {
    const handler = (message) => {
      if (message.type === MESSAGE_TYPES.SCAN_PROGRESS_EVENT) {
        listener(message.progress);
      }
    };
    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }
}

export const messageBus = new MessageBus();
