import {
  postOpenTab,
  postActiveTabChange,
  postWindowActive,
  postHideWindow,
  postRemoveTab,
  postRemoveWindow,
  postCreateWindow
} from './metric.js';

let browser = window.chrome || window.browser;


// INCOGNITO MODE

browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    let createData = {
      url: details.url.replace('.incognito.', ''),
      incognito: true,
    };
    browser.windows.create(createData);
    browser.tabs.remove(details.tabId);

    browser.extension.isAllowedIncognitoAccess(function(isAllowedAccess) {
      if (isAllowedAccess) return; // Great, we've got access

      browser.windows.create({
        url: 'chrome://extensions/?id=' + browser.runtime.id
      });
    
      // alert for a quick demonstration, please create your own user-friendly UI
      alert('Разрешите использование плагина в режиме инкогнито в открывшейся странице');
    });


  }, {
    urls: [
      "https://domclick.ru.incognito./*",
      "https://qa.domclick.ru.incognito./*",
      "http://domclick.ru.incognito./*",
      "http://qa.domclick.ru.incognito./*",
    ],
    types: ["main_frame"],
  },
  ["blocking"]
);


// TAB

const handleTabUpdated = (tabId, changeInfo, tabInfo) => {
  if (changeInfo.url) {
    postOpenTab(tabInfo);
  }
}

const handleActiveTabChange = async (tabId, selectInfo) => {
  browser.tabs.get(tabId, (tabInfo) => {
    postActiveTabChange(tabInfo);
  });
}

const handleTabRemove = (id) => {
  postRemoveTab({ id });
}

browser.tabs.onUpdated.addListener(handleTabUpdated);
browser.tabs.onActiveChanged.addListener(handleActiveTabChange);
browser.tabs.onRemoved.addListener(handleTabRemove);


// WINDOW

const handleWindowCreated = (browserWindow) => {
  postCreateWindow(browserWindow);
}

const handleWindowRemove = (id) => {
  postRemoveWindow({ id });
}

const handleWindowChange = (windowId) => {
  if (windowId && windowId > 0) {
    browser.windows.get(windowId, (browserWindow) => {
      postWindowActive(browserWindow);
    })
  } else {
    postHideWindow();
  }
}

browser.windows.onCreated.addListener(handleWindowCreated);
browser.windows.onRemoved.addListener(handleWindowRemove);
browser.windows.onFocusChanged.addListener(handleWindowChange);