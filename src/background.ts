'use strict';

import { Option } from "./app/models/option.model";
import { UpdateCallBack } from "./app/models/share.model";

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.onCreated.addListener(onTabCreated);
});

async function onTabCreated(tab: chrome.tabs.Tab) {
  const openedTabId = tab.id;
  const storage = await chrome.storage.sync.get('tabOptions');
  const tabOptions = storage['tabOptions'] as Option[];
  if (tab.url) {
    console.log('tab.url: ', tab);
    createCustomWindow(openedTabId as number, tab, tabOptions);
  } else {
    const updateCallback = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
      createCustomWindow(openedTabId as number, tab, tabOptions, updateCallback);
    }
    chrome.tabs.onUpdated.addListener(updateCallback);
  }
}

/**
 * Creates Custom window for the given tab
 * @param tab {chrome.tabs.Tab} The tab object that was created.
 */
function createCustomWindow(openedTabId: number, tab: chrome.tabs.Tab, tabOptions: Option[], cancelCallback?: UpdateCallBack) {
  if (!openedTabId || !tabOptions) {
    return;
  }
  const matchedIndex = tabOptions.findIndex(tabOption => {
    console.log('tabOption.url: ', tabOption.url, 'tab.url: ', tab.url, 'tabOption.active: ', tabOption.active);
    return tab.url?.includes(tabOption.url) && tabOption.active;
  });
  console.log('tabOptions: ', tabOptions);
  console.log('openedTabId === tab.id: ', openedTabId === tab.id , 'tab.status: ', tab.status);
  if (openedTabId === tab.id && matchedIndex > -1 && tab.status === 'complete') {
    console.log('updateCallback: ', JSON.parse(JSON.stringify(tab)));
    const createData: chrome.windows.CreateData = {
      tabId: tab.id,
      width: tabOptions[matchedIndex].position.width,
      height: tabOptions[matchedIndex].position.height,
      top: tabOptions[matchedIndex].position.top,
      left: tabOptions[matchedIndex].position.left,
      focused: true,
      // type: 'popup'
    };
    chrome.windows.create(createData, (window) => {
      if (tabOptions[matchedIndex].state === 'maximized' || tabOptions[matchedIndex].state === 'fullscreen') {
        chrome.windows.update((window as any).id, {state: tabOptions[matchedIndex].state});
      }
    });
    if (cancelCallback) {
      chrome.tabs.onUpdated.removeListener(cancelCallback);
    }
  }
}


